import os
import json
from oauth import OAuth2


def main(request):
    try:
        configs = json.loads(os.getenv("CONFIGS"))
        data = request.get_json()
        query_string = data["query_string"]
        url = "https://fantasysports.yahooapis.com/fantasy/v2/" + query_string
        oauth = OAuth2(browser_callback=True, **configs)
        if not oauth.token_is_valid():
            return "token in valid"

        query_result_data = oauth.session.get(url, params={"format": "json"})

        return query_result_data.json()
    except Exception as e:
        print(e)
        return e


if __name__ == "__main__":

    class Req(object):
        def __init__(self):
            pass

        def get_json(self):
            return {"query_string": "league/223.l.431/players;player_keys=223.p.5479/stats"}

    print(main(Req()))
