// ------------------------------------------------------------------------------------------------------------------
// Google Data Studio Community Data Connector for Wild Apricot
// Copyright (c) 2018-20 NewPath Consulting Inc.
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <https://www.gnu.org/licenses/>.
//
// Originally created by Edmond Tsoi (https://github.com/edtsoi430) for NewPath Consulting Inc.
// Maintained by Lon Motero (https://github.com/lmatero) for NewPath Consulting Inc.
// Further developed and restructured by Dennis Yoseph Zvigelsky (https://github.com/dzvigelsky) for NewPath Consulting Inc.
// Contact NewPath Consulting for support at https://www.newpathconsulting.com

// Version 2.0

// Google Connector Functions, called and logged

function getConfig(request) {
  return wa_connector.stackDriverLogging("getConfig", request);
}

function getSchema(request) {
  return wa_connector.stackDriverLogging("getSchema", request);
}

function getData(request) {
  return wa_connector.stackDriverLogging("getData", request);
}

function getAuthType(request) {
  return wa_connector.stackDriverLogging("getAuthType", request);
}
