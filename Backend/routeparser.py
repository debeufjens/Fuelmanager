from math import sin, cos, sqrt, atan2, radians
from repositories.DataRepository import DataRepository
from gpx_converter import Converter
from datetime import datetime
import csv
import os


class RouteParser:

    @staticmethod
    def get_distance_generategpx(data, nowtime):
        R = 6373.0
        distance = 0

        file = open(f'Code/Backend/gpxstore/{nowtime}.csv', 'w', newline='')

        with file:
            header = ['Latitude', 'Longitude']
            writer = csv.DictWriter(file, fieldnames=header)
            writer.writeheader()

            for x in range(len(data)-1):
                coords1 = data[x]
                if coords1['Longitude'] is not 0 or coords1['Latitude'] is not 0:

                    lon1 = radians(coords1['Longitude'])
                    lat1 = radians(coords1['Latitude'])

                    writer.writerow({'Latitude': coords1['Latitude'],
                                    'Longitude': coords1['Longitude']})

                    coords2 = data[x+1]
                    lon2 = radians(coords2['Longitude'])
                    lat2 = radians(coords2['Latitude'])

                    dlon = lon2 - lon1
                    dlat = lat2 - lat1

                    a = sin(dlat / 2)**2 + cos(lat1) * \
                        cos(lat2) * sin(dlon / 2)**2
                    c = 2 * atan2(sqrt(a), sqrt(1 - a))

                    distance += R * c

        Converter(input_file=f'Code/Frontend/gpxstore/{nowtime}.csv').csv_to_gpx(lats_colname='Latitude',
                                                                                 longs_colname='Longitude',
                                                                                 output_file=f'Code/Backend/gpxstore/{nowtime}.gpx')
        os.remove(f'Code/Frontend/gpxstore/{nowtime}.csv')

        return distance, f'/gpxstore/{nowtime}.gpx'

    @staticmethod
    def get_total_fuelusage(data):
        fuelusage = 0

        for x in range(len(data)):
            maf = float(data[x]['maf'])
            fuelusage += maf / 14700

        return fuelusage

    @staticmethod
    def get_avg_fuelrate(distance, fuel):
        return fuel / distance * 100

    @staticmethod
    def get_minmax_times(timequerry):
        return timequerry['mintime'], timequerry['maxtime']

    @staticmethod
    def get_avg_speed(data):
        return data['avgspeed']

    @staticmethod
    def get_current_fuel_cost(data):
        return data['Fuel_Cost']
