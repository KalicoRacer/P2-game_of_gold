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


# In[ ]:


app = Flask(__name__)

engine = create_engine(
'sqlite:///data/gold_blooded.sqlite',
connect_args={'check_same_thread': False}
)
conn = engine.connect()


# ## Tharunya's data source

# In[37]:


Tharunya_athletes = pd.read_sql_query("select nationality,sum(gold) Gold, sum(silver) Silver, sum(bronze) Bronze,sum(gold) + sum(silver) + sum(Bronze) Totals from athletes group by nationality having sum(gold) + sum(silver) + sum(Bronze) > 50 order by Totals desc",conn)
print(Tharunya_athletes)
Tharunya_athletes.to_csv(r'C:\Users\tepa7\Desktop\HW\P2-game_of_gold\Tharunya.csv')


# ## Johnny's data source

# In[7]:


countries = pd.read_sql_query("select * from countries",conn)
print(countries)


# In[ ]:


@app.route("/")
def index():
    """Return the homepage."""
    return "hello"

@app.route("/countries")
def names():
    """Return a list of sample names."""
    df_medalCount = pd.read_sql_query("select code, country, sum(gold) Gold, sum(silver) Silver, sum(bronze) Bronze                        from athletes A inner join countries C on A.nationality = C.code                        group by code, country", conn)
    df_medalCount['Total'] = df_medalCount["Gold"] + df_medalCount["Silver"] + df_medalCount["Bronze"]
    df_medalCount.sort_values(by=['Total'], ascending=False, inplace = True)
    df = df_medalCount.nlargest(20, 'Total')
    #You can display data either way, one as list or one as dictionary, whichever way you prefer
    # or you can create different way of displaying data depend on how you want but 
    #main thing you need to turn it into json
    
    df_list = df.values.tolist()
    countries = []
    length = len(df_list)
    i = 0
    
    for i in range(20):
        countries.append(df_list[i][0])
        i += 1

    df_json = jsonify(countries)
    return df_json
    #way2
    # df_json2 = df.to_json()
    # return df_json2    


# In[ ]:


@app.route("/medalCounts")
def medalCounts():
    """Return a list of sample names."""


df_medalCount = pd.read_sql_query("select code, country, sum(gold) Gold, sum(silver) Silver, sum(bronze) Bronze                    from athletes A inner join countries C on A.nationality = C.code                    group by code, country", conn)
df_medalCount['Total'] = df_medalCount["Gold"] + df_medalCount["Silver"] + df_medalCount["Bronze"]
df_medalCount.sort_values(by=['Total'], ascending=False, inplace = True)
df = df_medalCount.nlargest(20, 'Total')
df.to_csv(r'C:\Users\tepa7\Desktop\HW\P2-game_of_gold\Top20Countries.csv')


# In[ ]:


#You can display data either way, one as list or one as dictionary, whichever way you prefer
# or you can create different way of displaying data depend on how you want but 
#main thing you need to turn it into json

#way 1 
df_list = df.values.tolist()
df_json = jsonify(df_list)
return df_json
#way2
# df_json2 = df.to_json()
# return df_json2
if __name__ == '__main__':
    app.run(debug=True)

