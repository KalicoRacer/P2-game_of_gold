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
'sqlite:///../data/gold_blooded.sqlite',
connect_args={'check_same_thread': False}
)
conn = engine.connect()

# This is the grouping used for identifying the top 20 countries that we will be using for most of our visuals
df_medalCount = pd.read_sql_query("select code, country, cast(population as double) Population, \
        round(gdp_per_capita,0) GDP, count(*) TotalAthletes, \
        sum(gold) Gold, sum(silver) Silver, sum(bronze) Bronze \
        from athletes A inner join countries C on A.nationality = C.code \
        group by code, country, population, GDP", conn)
df_medalCount['Total'] = df_medalCount["Gold"] + df_medalCount["Silver"] + df_medalCount["Bronze"]
df_medalCount.sort_values(by=['Total'], ascending=False, inplace = True)
dfTop20 = df_medalCount.nlargest(20, 'Total')
dfTop20.to_csv(r'C:\Users\tepa7\Desktop\HW\P2-game_of_gold\Top20.csv')

# This is the df that Tharunya will be working on
Tharunya_athletes = pd.read_sql_query("select nationality,sum(gold) Gold, sum(silver) Silver, sum(bronze) Bronze,\
sum(gold) + sum(silver) + sum(Bronze) Totals from athletes \
group by nationality having sum(gold) + sum(silver) + sum(Bronze) > 50 \
order by Totals desc",conn)

@app.route("/")
def index():
    """Return the homepage."""
    return "hello"

@app.route("/CountryMedals")
def CountryMedals():
    # df_list = Tharunya_athletes.values.tolist()
    # df_json = jsonify(df_list)
    df_json2 = Tharunya_athletes.to_json()
    countries = []
    for c in cc:
        country = {'country_full_name': c[''], '': }
        countries.append(county)
    return jsonify(countries)

    # return df_json

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

    
if __name__ == '__main__':
    app.run(debug=True)
