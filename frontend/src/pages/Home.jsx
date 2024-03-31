import '../css/mapStyles.css';
import React, {useState, useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, useMap ,TileLayer, Marker, Popup, GeoJSON, LayersControl, FeatureGroup} from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import Select from 'react-select';
import countryList from 'react-select-country-list';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { EditControl } from "react-leaflet-draw";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faFlagCheckered} from '@fortawesome/free-solid-svg-icons'
import { faCarSide } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-free/css/all.css';
// import * as turf from '@turf/turf';
import "leaflet-draw/dist/leaflet.draw.css";


export const Home = () => {
    const [navbarHeight, setNavbarHeight] = useState(0);
    const [options, setOptions] = useState(countryList().getData());
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [countryData, setCountryData] = useState(null);
    const [center, setCenter] = useState([37.090215, -95.712915]);
    const [zoom, setZoom] = useState(4);
    const [countryBorders, setCountryBorders] = useState(null);
    const [geoJsonKey, setGeoJsonKey] = useState(Math.random());

    //to get height of the navbar
    useEffect(() => {
        const navbar = document.getElementById('navbar');
        setNavbarHeight(navbar.offsetHeight);
    }, []);

    useEffect(() => {
        if (selectedCountry) {
          const provider = new OpenStreetMapProvider();
          provider.search({ query: selectedCountry.label }).then((result) => {
            setCountryData(result[0]);
            console.log(result[0]);
          });
          
          fetch(`http://localhost:5000/country/${selectedCountry.label}`)
            .then((response) => response.json())
            .then((data) => {
              setCountryBorders(data);
              //to re-render the GeoJSON component with the new data
              setGeoJsonKey(Math.random());
          });
        }
    }, [selectedCountry]);

    //to change the view of the map when a new country is selected
    const ChangeView = ({ center, zoom }) => {
      const map = useMap();
      map.flyTo(center, zoom);
      return null;
    };

    //styles for the select component
    const customStyles = {
        control: (provided) => ({
          ...provided,
          backgroundColor: 'white',
          borderColor: 'gray',
          borderWidth: 1,
          boxShadow: 'none',
          '&:hover': {
            borderColor: 'gray',
          },
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isSelected ? '#c7d2fe' : 'white',
          color: 'black',
          '&:hover': {
            backgroundColor: '#e0e7ff',
            color: 'black',
          },
        }),
    };

    const [markerPosition, setMarkerPosition] = useState(null);
    const [teamCount, setTeamCount] = useState(0);
    const [teamPositions, setTeamPositions] = useState([[]]);

    // const markerIcon = <FontAwesomeIcon icon={faFlagCheckered} />
    const finishIcon = L.divIcon({
      className: 'custom-icon',
      html: `<i class="fas fa-location-dot"></i>`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });
    const teamIcon = L.divIcon({
      className: 'custom-icon',
      html: `<i class="fas fa-car-side"></i>`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });
    const handleTeamCountChange = (event) => {
      setTeamCount(event.target.value);
    };
    const handleFormSubmit = (event) => {
      event.preventDefault(); // Prevent the form from refreshing the page
      console.log('Form submitted with team count:', teamCount, 'and selected country:', selectedCountry);
    };
    return (
        <div className="grid grid-cols-12 h-screen" style={{ height: `calc(100vh - ${navbarHeight}px)` }}>
            <div className="col-span-3 bg-blue-200 p-4">
                <h1 className="text-xl font-bold mb-4">Select Country</h1>
                <div>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <Select 
                      options={options} 
                      value={selectedCountry} 
                      onChange={setSelectedCountry} 
                      styles={customStyles} 
                      className='pb-4'
                    />
                    <div className="flex flex-col">
                      <label htmlFor="teamCount" className="mb-2 font-semibold text-lg">Number of Teams:</label>
                      <input
                        type="number"
                        id="teamCount"
                        value={teamCount}
                        onChange={handleTeamCountChange}
                        className="p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded mb-2 hover:bg-blue-600">Suggest Target Places</button>
                  </form>
                </div>
                
            </div>
            <div className="col-span-9 bg-blue-300 p-4">
                <MapContainer center={center} zoom={zoom} className="h-full w-full">
                    <ChangeView center={countryData ? [countryData.y, countryData.x] : center} zoom={4} />
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <LayersControl position="topright">
                      <LayersControl.Overlay name="Highlight Country" checked>
                        {countryBorders && <GeoJSON key={geoJsonKey} data={countryBorders} />}
                      </LayersControl.Overlay>
                    </LayersControl>
                    <FeatureGroup>
                      <EditControl
                        position='bottomleft'
                        onCreated={e => {
                          if (e.layerType === 'marker') {
                            console.log('teamCount:', teamCount); // Add this
                            console.log('teamPositions.length:', teamPositions.length); // Add this
                            console.log('markerPosition:', markerPosition); // Add this
                            if (!markerPosition) {
                              // Create the finish line marker
                              e.layer.setIcon(finishIcon);
                              setMarkerPosition(e.layer.getLatLng());
                              console.log(e.layer.getLatLng());
                            } else if (teamPositions.length < Number(teamCount)) {
                              // Create a team marker
                              e.layer.setIcon(teamIcon);
                              setTeamPositions([...teamPositions, e.layer.getLatLng()]);
                              console.log(e.layer.getLatLng());
                            } else {
                              // Delete the marker if the maximum number of markers has been reached
                              e.layer.remove();
                            }
                          }
                        }}
                        onEdited={e => {
                          e.layers.eachLayer((layer) => {
                            if (layer instanceof L.Marker) {
                              setMarkerPosition(layer.getLatLng());
                              console.log(layer.getLatLng());
                            }
                          });
                        }}
                        onDeleted={e => {
                          setMarkerPosition(null);
                        }}
                        draw={{
                          rectangle: false,
                          polyline: false,
                          circle: false,
                          circlemarker: false,
                          polygon: false
                        }}
                      />
                    </FeatureGroup>
                </MapContainer>
            </div>
        </div>
    ) 
}