import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet marker icon path
let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;


const FlyToDistrict = ({ coords }) => {
    const map = useMap();
    if (coords) {
        map.flyTo(coords, 14, { duration: 1.5 })
    };
    return null;
}


const BangladeshMap = ({ serviceCenter }) => {
    const [searchText, setSearchText] = useState('')
    const [activeCoords, setActiveCoords] = useState(null)
    const [activeDistrict, setActiveDistrict] = useState(null)


    const handleSearch = (e) => {
            e.preventDefault();
        const found = serviceCenter.find(center =>
            center.district.toLowerCase().includes(searchText.toLowerCase())
        );

        if (found
            // && mapRef.current
        ) {
            setActiveCoords([found.latitude, found.longitude]);
            setActiveDistrict(found.district)
        }
    };



    return (
        <div className='w-full h-[600px] relative'>
            <form onSubmit={handleSearch} className='absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000]  flex bg-gray-600'>
                <input
                    type="text"
                    placeholder='Search district'
                    className='flex-1 px-4 py-2 border text-white font-bold rounded-l-md'
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded-r-md'>Go</button>
            </form>
            <MapContainer
                center={[23.685, 90.3563]} // Bangladesh center
                zoom={8}
                scrollWheelZoom={true}
                dragging={false}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://osm.org">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <FlyToDistrict coords={activeCoords}/>

                {serviceCenter.map((service, idx) => (
                    <Marker key={idx} position={[service.latitude, service.longitude]}>
                        {/* <Popup>{service.name}</Popup> */}
                        <Popup autoOpen={service.district === activeDistrict}>
                            <div>
                                <h3 className="font-bold">{service.city}</h3>
                                <p><strong>District:</strong> {service.district}</p>
                                <p><strong>Areas:</strong> {service.covered_area.join(', ')}</p>
                                {/* Optional: show flowchart */}
                                <img
                                    src={service.flowchart}
                                    alt={`${service.city} flowchart`}
                                    className="mt-2 rounded"
                                    style={{ width: '100px' }}
                                />
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default BangladeshMap;