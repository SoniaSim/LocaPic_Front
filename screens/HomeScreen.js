import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, ImageBackground, AsyncStorage, View, Text} from 'react-native';
import {Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';

function HomeScreen({navigation, onSubmitPseudo}) {
    
    const [pseudo, setPseudo] = useState('');

    useEffect(() => {
      AsyncStorage.getItem("firstName", function(error, data){
        setPseudo(data)
        // console.log(pseudo) 
              })
    }, []);

  return (
        <ImageBackground source={require('../assets/home.jpg')} style={styles.container}>

        {!pseudo ?
            <Input
                containerStyle = {{marginBottom: 25, width: '70%'}}
                inputStyle={{marginLeft: 10}}
                placeholder='Name'
                leftIcon={{ type: 'font-awesome', name: 'user', color: "#eb4d4b" }}
                onChangeText={(val) => setPseudo(val)}
            /> :
              <Text style={{fontSize:35, color:"white", marginBottom:40}} >Welcome Back {pseudo}</Text> 
        }
              <Button icon={
                  <Icon
                  name="arrow-right"
                  size={15}
                  color="#eb4d4b"
                  />
              } title="Go to Map"
              onPress={() => {
                AsyncStorage.setItem("firstName", pseudo);
                navigation.navigate('Map');
                onSubmitPseudo(pseudo)
              }}
              />

        </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function mapDispatchToProps(dispatch) {
    return {
      onSubmitPseudo: function(pseudo) { 
        dispatch( {type: 'savePseudo', pseudo }) 
      }
    }
  }
  
  export default connect(
      null, 
      mapDispatchToProps
  )(HomeScreen);