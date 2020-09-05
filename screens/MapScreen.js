import React, {useEffect, useState} from 'react';
import { StyleSheet, View, Dimensions, AsyncStorage } from 'react-native';

import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import { Button, Input, Overlay } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

import {connect} from 'react-redux';
import socketIOClient from "socket.io-client";

var socket = socketIOClient("http://192.168.1.38");

export default function MapScreen(props) {

  const [currentLatitude, setCurrentLatitude] = useState(null)
  const [currentLongitude, setCurrentLongitude] = useState(null)
  const [addPOI, setAddPOI] = useState(false)
  const [listPOI, setListPOI] = useState([])
  const [disabled, setDisbled] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [title, setTitle] = useState()
  const [description, setDescription] = useState()
  const [tempPOI, setTempPOI] = useState();
  const [listUser, setListUser] = useState([]);



  useEffect(() => {
    async function askPermissions() {
      var { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status === 'granted') {
        Location.watchPositionAsync({distanceInterval: 2},
          (location) => {
            setCurrentLatitude(location.coords.latitude)
            setCurrentLongitude(location.coords.longitude)
            socket.emit("userLocation", {pseudo: props.pseudo, longitude: location.coords.longitude, latitude: location.coords.latitude} )
          }
        );
      }
    }
    askPermissions();

    AsyncStorage.getItem("POI", 
    function(err, data){
      if(data){
        var POI = JSON.parse(data)
        setListPOI(POI)
      }
    })
  }, []);

  useEffect(() => { 
    socket.on('userLocationToAll', (newUSer)=> {
      console.log(newUSer);
      var listUserCopy = [...listUser];
      listUserCopy = listUserCopy.filter(user => user.pseudo != newUSer.pseudo);
      listUserCopy.push(newUSer)
      setListUser(listUserCopy);
    });
  }, [listUser]) 

  var selectPOI = (coord) => {
    if(addPOI){
      setAddPOI(false);
      setOpenModal(true)
      setTempPOI({ latitude: coord.nativeEvent.coordinate.latitude, longitude: coord.nativeEvent.coordinate.longitude } );
    }
   }

   var handleSubmit = () => {
    var copyListPOI = [...listPOI, {longitude: tempPOI.longitude, latitude: tempPOI.latitude, title: title, description: description } ]

    AsyncStorage.setItem("POI", JSON.stringify(copyListPOI))

    setListPOI(copyListPOI);

    setOpenModal(false);
    setTempPOI();
    setTitle();
    setDescription();
  }

    var listMark = listPOI.map((coord, i) =>{
      return (
      <Marker key={i}
      coordinate={{latitude: coord.latitude, longitude: coord.longitude}}
      title={coord.title}
      description={coord.description}
      pinColor='blue'
      />
    )
    })
    
    var markerUser = listUser.map((user,i)=>{
      return <Marker
      key={i}
      coordinate={{latitude: user.latitude, longitude: user.longitude}}
            pinColor='pink'
            title={user.pseudo}
          />
    })

  if(currentLongitude === null || currentLatitude == null){
    return (
      <View></View>
    )
  } else {
    return (
      <View style={styles.container}>
        <MapView style={styles.mapStyle}
                  initialRegion={{
                    latitude: currentLatitude,
                    longitude: currentLongitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                onPress ={ (coordinate) => {selectPOI(coordinate); setDisbled(false)}}
        >
          <Marker
            coordinate={{latitude: currentLatitude, longitude: currentLongitude}}
            title="Hello"
            description="I'am here"
          />
          {listMark}
          {markerUser}
        </MapView>
        <Button
          containerStyle={{marginBottom: 60}}
          buttonStyle={{width: 400, height:40, backgroundColor: "#eb4d4b"}}
          icon={
            <Icon
              name="map-marker"
              size={20}
              color="white"
            />
          }
          title="Add POI"
          onPress={() => {setAddPOI(true), setDisbled(true)} }
          disabled={disabled}
          />
          <Overlay isVisible={openModal}
                     onBackdropPress={() => setOpenModal(false) }
          >
            <Input placeholder='title'
                    containerStyle = {{width: 250}}
                    onChangeText={(val) => setTitle(val)}
            />
            <Input placeholder='description'
                      containerStyle = {{width: 250}}
                      onChangeText={(val) => setDescription(val)}
            />
            <Button
                  buttonStyle={{width: 250, height:40, backgroundColor: "#eb4d4b", marginBottom: 100}}
                  onPress={() => handleSubmit()}
                  icon={
                    <Icon
                      name="map-marker"
                      size={20}
                      color="white"
                    />
                  }
                  title="Add POI"
            />
          </Overlay>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});