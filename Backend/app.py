import os
from repositories.DataRepository import DataRepository
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit, send

import serial
import time
from datetime import datetime
import string
import pynmea2
import threading

from routeparser import RouteParser


def parse_route():

    if(DataRepository.get_measurement_count()['count'] is not 0):
        df = DataRepository.delete_empty_measurements()

        vehicleid = 1
        coordsdata = DataRepository.get_coordinates()
        all_mafsdata = DataRepository.get_mafs()
        startstopdata = DataRepository.get_startstop_times()
        fuelcostdata = DataRepository.get_current_fuelprice(vehicleid)
        speeddata = DataRepository.get_avg_speed()
        nowtime = datetime.now()

        routedistance, gpxlocation = RouteParser.get_distance_generategpx(
            coordsdata, nowtime)

        totalfuelusage = RouteParser.get_total_fuelusage(all_mafsdata)

        fuelrate = RouteParser.get_avg_fuelrate(routedistance, totalfuelusage)
        starttime, stoptime = RouteParser.get_minmax_times(startstopdata)

        current_fuelcost = RouteParser.get_current_fuel_cost(fuelcostdata)

        avg_speed = RouteParser.get_avg_speed(speeddata)

        data = DataRepository.create_route(
            starttime, stoptime, routedistance, totalfuelusage, fuelrate, gpxlocation, vehicleid, current_fuelcost, avg_speed)

        trunc = DataRepository.truncate_measurements()


gps_lat = 0
gps_lon = 0


def read_gps():
    global gps_lat
    global gps_lon
    while True:
        port = '/dev/serial0'
        ser = serial.Serial(port, baudrate=9600, timeout=0.5)
        dataout = pynmea2.NMEAStreamReader()
        newdata = str(ser.readline().decode())

        if newdata[0:6] == "$GNRMC":
            newmsg = pynmea2.parse(newdata)
            gps_lat = newmsg.latitude
            gps_lon = newmsg.longitude


def start_display():
    cmd = "/usr/bin/chromium-browser --start-fullscreen 0.0.0.0/display.html"
    os.system(cmd)


# Start app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'geheim!'
socketio = SocketIO(app, cors_allowed_origins="*", logger=False,
                    engineio_logger=False, ping_timeout=1)
CORS(app)

# Variables
endpoint = '/api'

# Threads


@socketio.on_error()        # Handles the default namespace
def error_handler(e):
    print(e)


@socketio.on('connect')
def initial_connection():
    print('A new client connect')
    emit('connected',  broadcast=True)
    emit('dataUpdate', {
        'kph': 55, 'rpm': 1889, 'maf': 19.66, 'coolant': 84}, broadcast=True)


# ROUTES

# obd route start


@app.route(endpoint + '/postobd', methods=['POST'])
def post_obd_data():
    if request.method == 'POST':
        gegevens = DataRepository.json_or_formdata(request)
        print(gegevens)
        rpm = gegevens['rpm']
        maf = gegevens['maf']
        speed = gegevens['speed']
        coolant = gegevens['coolant']
        vehicleid = 1
        lat = gps_lat
        lon = gps_lon
        print(coolant, rpm, speed, maf, vehicleid, lat, lon)

        socketio.emit('dataUpdate', {
                      'kph': speed, 'rpm': rpm, 'maf': maf, 'coolant': coolant}, broadcast=True)

        data = DataRepository.obd_measurement(
            coolant, rpm, speed, maf, vehicleid, lat, lon)

        return jsonify(), 200
# obd route end

# totals routes start


@app.route(endpoint + '/data/totalfuel', methods=['GET'])
def get_totalfuel():
    if request.method == 'GET':
        return jsonify(DataRepository.get_totalfuel()), 200


@app.route(endpoint + '/data/totaldistance', methods=['GET'])
def get_totaldistance():
    if request.method == 'GET':
        return jsonify(DataRepository.get_totaldistance()), 200


@app.route(endpoint + '/data/totalruntime', methods=['GET'])
def get_totalruntime():
    if request.method == 'GET':
        return jsonify(DataRepository.get_totalruntime()), 200


@app.route(endpoint + '/data/avgavgspeed', methods=['GET'])
def get_avgavgspeed():
    if request.method == 'GET':
        return jsonify(DataRepository.get_avgavgspeed()), 200


@app.route(endpoint + '/data/totalcost', methods=['GET'])
def get_totalcost():
    if request.method == 'GET':
        return jsonify(DataRepository.get_totalcost()), 200
# total routes end

# fuelcharts routes start


@app.route(endpoint + '/data/charts/fuel/daily', methods=['GET'])
def get_charts_daily_fuelrates():
    if request.method == 'GET':
        return jsonify(DataRepository.get_daily_fuelrates()), 200


@app.route(endpoint + '/data/charts/fuel/weekly', methods=['GET'])
def get_charts_weekly_fuelrates():
    if request.method == 'GET':
        return jsonify(DataRepository.get_weekly_fuelrates()), 200


@app.route(endpoint + '/data/charts/fuel/monthly', methods=['GET'])
def get_charts_monthly_fuelrates():
    if request.method == 'GET':
        return jsonify(DataRepository.get_monthly_fuelrates()), 200


@app.route(endpoint + '/data/charts/fuel/yearly', methods=['GET'])
def get_charts_yearly_fuelrates():
    if request.method == 'GET':
        return jsonify(DataRepository.get_yearly_fuelrates()), 200
# fuelcharts routes stop

# routes start


@app.route(endpoint + '/data/routes/allroutes', methods=['GET'])
def get_all_routes():
    if request.method == 'GET':
        return jsonify(DataRepository.get_all_routes()), 200


@app.route(endpoint + '/data/routes/<date>', methods=['GET'])
def get_routes_by_date(date):
    if request.method == 'GET':
        return jsonify(DataRepository.get_all_routes_by_date(date)), 200
# routes end

# costs start


@app.route(endpoint + '/data/costs', methods=['GET'])
def get_costs():
    if request.method == 'GET':

        return jsonify(DataRepository.get_costs()), 200
# costs end


# settings start


@app.route(endpoint + '/data/settings/<vehicleid>', methods=['GET', 'PUT'])
def get_vehicle_information(vehicleid):
    if request.method == 'GET':
        return jsonify(DataRepository.get_vehicle_information(vehicleid)), 200
    elif request.method == 'PUT':
        gegevens = DataRepository.json_or_formdata(request)
        data = DataRepository.update_vehicle(gegevens['vehicleID'], gegevens['Brand'],
                                             gegevens['Model'], gegevens['Engine_Size'], gegevens['KW'], gegevens['Fuel_Type'], gegevens['Fuel_Cost'])
        return jsonify(data), 200

# settings end


# Start app
if __name__ == '__main__':

    thread_gps = threading.Thread(target=read_gps, args=())
    thread_gps.start()
    # parse_route()
    thread_display = threading.Thread(target=start_display, args=())
    thread_display.start()

    socketio.run(app, debug=False, host='0.0.0.0')
