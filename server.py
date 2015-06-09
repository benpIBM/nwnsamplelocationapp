import os
import cloudant
try:
  from SimpleHTTPServer import SimpleHTTPRequestHandler as Handler
  from SocketServer import TCPServer as Server
except ImportError:
  from http.server import SimpleHTTPRequestHandler as Handler
  from http.server import HTTPServer as Server

# Read port selected by the cloud for our application
PORT = int(os.getenv('VCAP_APP_PORT', 8000))


# connect to your account
# in this case, https://garbados.cloudant.com
USERNAME = 'nwntest'
account = cloudant.Account(USERNAME)

# login, so we can make changes
login = account.login(USERNAME, '1England')
assert login.status_code == 200


response = account.get()
print response.json()

database = account.database('env_hazmat_wgs84')
design = database.design('SpatialView')
index = design.index('_geo/spatial')
view = index.get(params={'lon':-122.3249172489999, 'lat':45.55996990500006, 'relation': 'contains', 'include_docs': 'true', 'radius':10000})
print view.text

print 'connected!'


# Change current directory to avoid exposure of control files
os.chdir('static')

httpd = Server(("", PORT), Handler)
try:
  print("Start serving at port %i" % PORT)
  httpd.serve_forever()
except KeyboardInterrupt:
  pass
httpd.server_close()