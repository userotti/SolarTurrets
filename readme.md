# Auto/Otto

Websocket/Multiplayer fun

## Resources

Autobahn JS : [http://autobahn.ws/js/](http://autobahn.ws/js/)

## Running Basicrouter (Twisted/Worker Server)

- cd into the project folder
- run "python basicrouter.py" or "pypy basicrouter.py" in PyPy's case.

This should start the Worker Factory.

### Example:

`ubuntu@ip-10-243-35-133:~/auto$ python basicrouter.py`

`2014-07-21 10:02:39+0000 [-] Log opened.`

`2014-07-21 10:02:42+0000 [-] Running on reactor <twisted.internet.epollreactor.EPollReactor object at 0x00000000052e9600>`

`2014-07-21 10:02:42+0000 [-] WampWebSocketServerFactory starting on 8080`

`2014-07-21 10:02:42+0000 [-] Starting factory <autobahn.twisted.websocket.WampWebSocketServerFactory instance at 0x0000000006957fa0>`

## Other

Make sure to serve files inside a localhost via port 80. (MAMP/WAMP/Nginx/etc.)

### Simple Python Server

- cd into the project folder
- run "sudo python -m SimpleHTTPServer 80"

This should start a HTTP server from that folder on port 80.

## Licence

Copyright 2014 Foxinni Web Development


