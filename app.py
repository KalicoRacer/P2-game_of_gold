import os
import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_jsonpify import jsonpify
from flask_sqlalchemy import SQLAlchemy

import pandas as pd
import sqlite3
from flask import Flask, jsonify, render_template

app = Flask(__name__)

# #app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///gold_blooded.sqlite"
# #app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# #conn = sqlite3.connect("gold_blooded.sqlite")
# ​
#Use This connection 2 line below rather than the above connection way
engine = create_engine(
'sqlite:///data/gold_blooded.sqlite',
connect_args={'check_same_thread': False}
)
conn = engine.connect()

# This is the grouping used for identifying the top 20 countries that we will be using for most of our visuals
df_medalCount = pd.read_sql_query("select code, country, cast(population as double) population, \
        round(gdp_per_capita,0) gdp, count(*) athletes, \
        sum(gold) gold, sum(silver) silver, sum(bronze) bronze \
        from athletes A inner join countries C on A.nationality = C.code \
        group by code, country, population, GDP", conn)
df_medalCount['total_medals'] = df_medalCount["gold"] + df_medalCount["silver"] + df_medalCount["bronze"]
df_medalCount.sort_values(by=['total_medals'], ascending=False, inplace = True)
dfTop20 = df_medalCount.nlargest(20, 'total_medals')
df_gender = pd.read_sql_query("select nationality, sex,count(*) TotCountry from Athletes \
    group by nationality, sex", conn)    
df_bmi = pd.read_sql_query("select nationality, weight/(height* height) BMI, gold + silver + bronze as TotalMedals \
    from Athletes where gold + silver + bronze > 0 and height > 0 and weight > 0", conn)
df_bmi_grouped = pd.read_sql_query("select round(weight/(height* height),0) BMI, sum(gold) + sum(silver) + sum(bronze) as TotalMedals \
    from Athletes where gold + silver + bronze > 0 and height > 0 and weight > 0 \
    group by weight/(height* height)", conn)


# dfTop20.to_csv(r'C:\Users\tepa7\Desktop\HW\P2-game_of_gold\Top20.csv')

# This is the df that Tharunya will be working on
Tharunya_athletes = pd.read_sql_query("select nationality,sum(gold) Gold, sum(silver) Silver, sum(bronze) Bronze,\
sum(gold) + sum(silver) + sum(Bronze) Totals from athletes \
group by nationality having sum(gold) + sum(silver) + sum(Bronze) > 50 \
order by Totals desc",conn)

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/dashboard")
def dashboard():
    """Return the homepage."""
    return render_template("dashboard.html")

@app.route("/CountryMedals")
def CountryMedals():
    df_list = Tharunya_athletes.values.tolist()
    df_json = jsonify(df_list)
    # df_json2 = Tharunya_athletes.to_json()
    # countries = []
    # for c in cc:
    #     country = {'country_full_name': c[''], '': }
    #     countries.append(county)
    # return jsonify(countries)

    return df_json

@app.route("/countries")
def names():
    """Return a list of sample names."""
    
    df_countries = dfTop20.values.tolist()
    countries = []
    length = len(df_countries)
    i = 0
    
    for i in range(20):
        countries.append(df_countries[i][0])
        i += 1

    df_json = jsonify(countries)
    return df_json

        #way2
    # df_json2 = df.to_json()
    # return df_json2    

@app.route("/gender")
def gender():
    df_list = df_gender.values.tolist()
    df_json = jsonify(df_list)
    return df_json

@app.route("/bmi")
def bmi():
    df_list = df_bmi_grouped.values.tolist()
    df_json = jsonify(df_list)
    return df_json
    
if __name__ == '__main__':
    app.run(debug=True)
