from .database import Database


class DataRepository:
    @staticmethod
    def json_or_formdata(request):
        if request.content_type == 'application/json':
            gegevens = request.get_json()
        else:
            gegevens = request.form.to_dict()
        return gegevens

    @staticmethod
    def obd_measurement(coolant, rpm, speed, maf, vehicleID, lat, lon):
        sql = "INSERT INTO Measurement ( Timestamp, Coolant_Temp, Rpm, Speed, Maf, VehicleID, Latitude, Longitude) VALUES (now(3),%s,%s,%s,%s,%s,%s,%s)"
        params = [coolant, rpm, speed, maf, vehicleID, lat, lon]
        return Database.execute_sql(sql, params)

    # routeparser start
    @staticmethod
    def get_coordinates():
        sql = "select Latitude, Longitude from Measurement"
        return Database.get_rows(sql)

    @staticmethod
    def get_mafs():
        sql = "select maf from Measurement"
        return Database.get_rows(sql)

    @staticmethod
    def get_startstop_times():
        sql = "select min(Timestamp) as mintime,max(Timestamp) as maxtime from Measurement"
        return Database.get_one_row(sql)

    @staticmethod
    def get_avg_speed():
        sql = "select avg(Speed) as avgspeed from Measurement"
        return Database.get_one_row(sql)

    @staticmethod
    def get_current_fuelprice(vehicleid):
        sql = "select Fuel_Cost from Vehicle where VehicleID = %s"
        params = [vehicleid]
        return Database.get_one_row(sql, params)

    @staticmethod
    def create_route(starttime, stoptime, distance, totalfuel, avgfuelrate, gpxfile, vehicleID, currfuelcost, avgspeed):
        sql = "INSERT INTO Tour(StartTime, StopTime, Distance, Total_Fuel, Avg_Fuelrate, GPX_File, VehicleID,Current_FuelPrice,Average_Speed) VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s)"
        params = [starttime, stoptime, distance,
                  totalfuel, avgfuelrate, gpxfile, vehicleID, currfuelcost, avgspeed]
        return Database.execute_sql(sql, params)

    @staticmethod
    def delete_empty_measurements():
        sql = "DELETE from Measurement where Latitude like 0 or Longitude like 0"
        return Database.execute_sql(sql)

    @staticmethod
    def get_measurement_count():
        sql = "select count(Timestamp) as count from Measurement"
        return Database.get_one_row(sql)

    @staticmethod
    def truncate_measurements():
        sql = "truncate Measurement"
        return Database.execute_sql(sql)
    # routeparser end

    # totals start

    @staticmethod
    def get_totalfuel():
        sql = "select sum(Total_Fuel) as totalfuel from Tour"
        return Database.get_one_row(sql)

    @staticmethod
    def get_totaldistance():
        sql = "select sum(Distance) as totaldistance from Tour"
        return Database.get_one_row(sql)

    @staticmethod
    def get_totalruntime():
        sql = "select convert(SEC_TO_TIME(SUM(TIME_TO_SEC(StopTime) - TIME_TO_SEC(StartTime))),char) AS totalruntime from Tour"
        return Database.get_one_row(sql)

    @staticmethod
    def get_avgavgspeed():
        sql = "select avg(Average_Speed) as avgavgspeed from Tour"
        return Database.get_one_row(sql)

    @staticmethod
    def get_totalcost():
        sql = "select sum(Total_Fuel*Current_FuelPrice) as totalcost from Tour"
        return Database.get_one_row(sql)
    # totals end

    # fuelcharts start
    @staticmethod
    def get_daily_fuelrates():
        sql = "SELECT HOUR(StartTime) as hourofday, sum(Total_Fuel) as totalfuel, avg(Avg_Fuelrate) as avgfuel FROM Tour WHERE MONTH(StartTime)  = MONTH(CURRENT_DATE()) AND DAY(StartTime) = DAY(current_date()) AND YEAR(StartTime) = YEAR(CURRENT_DATE()) group by hourofday order by hourofday asc"
        return Database.get_rows(sql)

    def get_weekly_fuelrates():
        sql = "SELECT weekday(StartTime) as weekday, sum(Total_Fuel) as totalfuel, avg(Avg_Fuelrate) as avgfuel FROM Tour WHERE MONTH(StartTime)  = MONTH(CURRENT_DATE()) AND yearweek(StartTime,1) = yearweek(current_date(),1) AND YEAR(StartTime) = YEAR(CURRENT_DATE()) group by weekday order by weekday asc"
        return Database.get_rows(sql)

    @staticmethod
    def get_monthly_fuelrates():
        sql = "SELECT dayofmonth(StartTime) as dayofmonth, sum(Total_Fuel) as totalfuel, avg(Avg_Fuelrate) as avgfuel FROM Tour WHERE MONTH(StartTime)  = MONTH(CURRENT_DATE()) AND YEAR(StartTime) = YEAR(CURRENT_DATE()) group by dayofmonth order by dayofmonth asc"
        return Database.get_rows(sql)

    @staticmethod
    def get_yearly_fuelrates():
        sql = "SELECT month(StartTime) as monthofyear, sum(Total_Fuel) as totalfuel, avg(Avg_Fuelrate) as avgfuel FROM Tour WHERE YEAR(StartTime) = YEAR(CURRENT_DATE()) group by monthofyear order by monthofyear asc"
        return Database.get_rows(sql)
    # fuelcharts end

    # routes start
    @staticmethod
    def get_all_routes():
        sql = "select * from Tour"
        return Database.get_rows(sql)

    @staticmethod
    def get_all_routes_by_date(date):
        sql = "select * from Tour where date(StartTime) = %s"
        params = [date]
        return Database.get_rows(sql, params)
    # routes end

    # costs start
    @staticmethod
    def get_average_costs():
        sql = ""
    # costs end

    @staticmethod
    def get_costs():
        sql = "select (avg(Total_Fuel) * Current_FuelPrice) / count(*)  as avgCostsRoute, (avg(Total_Fuel) * Current_FuelPrice) / Distance as avgCostsKM, avg(Current_FuelPrice) as avgCostsFuelprice from Tour"
        return Database.get_one_row(sql)

    # settings start
    @staticmethod
    def get_vehicle_information(vehicleid):
        sql = "select * from Vehicle where VehicleID = %s"
        params = [vehicleid]
        return Database.get_one_row(sql, params)

    def update_vehicle(vehicleID, Brand, Model, Engine_Size, KW, Fuel_Type, Fuel_Cost):
        sql = "UPDATE Vehicle SET Brand = %s, Model = %s, Engine_Size = %s, KW = %s, Fuel_Type = %s, Fuel_Cost = %s WHERE VehicleID = %s"
        params = [Brand, Model, Engine_Size,
                  KW, Fuel_Type, Fuel_Cost, vehicleID]
        return Database.execute_sql(sql, params)

    # settings end
