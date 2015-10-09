###Week 1
- I spent a lot of time on research this Week
  - Decided against using a separate front-end framework (React etc)
  - Read D3.js documentation and did some initial tutorials
  - Reading on how I wanted to structure my app (with a JQuery/Ajax/D3 front-end and a Rails API backend)
  - Getting my database seed file ready to go
  - Multiple conversations about structure and design (my old boss who is a Director of Institutional research, Chef, Crystal, Kai)

###Next Week
- Seed an initial database implementation
- Get working d3 visualizations up on my site
  - D3 needs will determine my API endpoints/interaction
  - Need to pick the graphing option/structure in D3 (filling bucket objects, bar graphs etc)
  - Figure out how the Zip Code API will be integrated and visualized

####Notes about Zip Code API
Distance between two zips:
https://www.zipcodeapi.com/rest/8vK8uawexCiMWYzxzZZw5QvyMxEr1mXaRIjlSPzqrScnQMVpLUVQLrpyY300pYbg/distance.json/98144/21031/mile

For finding lat/long for a zip code: (if going to do map viz)
https://www.zipcodeapi.com/rest/<api_key>/info.<format>/<zip_code>/<units>
https://www.zipcodeapi.com/rest/8vK8uawexCiMWYzxzZZw5QvyMxEr1mXaRIjlSPzqrScnQMVpLUVQLrpyY300pYbg/info.json/98144/degrees
Example response
{
    "zip_code": "98144",
    "lat": 47.585634,
    "lng": -122.292106,
    "city": "Seattle",
    "state": "WA",
    "timezone": {
        "timezone_identifier": "America/Los_Angeles",
        "timezone_abbr": "PDT",
        "utc_offset_sec": -25200,
        "is_dst": "T"
    },
    "acceptable_city_names": [
        {
            "city": "Beacon Hill",
            "state": "WA"
        }
    ]
}
