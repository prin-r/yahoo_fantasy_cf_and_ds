#!/usr/bin/env python3

import sys
import requests

HEADERS = {"Content-Type": "application/json"}
URL = "https://australia-southeast1-band-playground.cloudfunctions.net/zzz-test"


def main(request_path, keys):
    result = requests.request(
        "POST", URL, headers=HEADERS, json={"query_string": request_path}
    ).json()

    if "fantasy_content" in result:
        final_value = result["fantasy_content"]
        for key in keys.split(","):
            # list
            if isinstance(final_value, list):
                if not key.isdigit():
                    raise ValueError('index must be positive integer but got "' + key + '"')

                final_value = final_value[int(key)]
                continue

            # dict
            if key in final_value:
                final_value = final_value[key]
                continue

            raise ValueError('key "' + key + '" not found')

        return final_value

    raise ValueError('key "fantasy_content" not found')


if __name__ == "__main__":
    try:
        print(main(*sys.argv[1:]))
    except Exception as e:
        print(str(e), file=sys.stderr)
        sys.exit(1)
