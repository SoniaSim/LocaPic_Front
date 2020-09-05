import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView  } from 'react-native';
import {Button, ListItem, Input} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import socketIOClient from "socket.io-client";
import {connect} from 'react-redux';


var socket = socketIOClient("http://192.168.1.38:3000");


function ChatScreen(props) {

  const [currentMessage, setCurrentMessage] = useState();
  const [listMessage, setListMessage] = useState([]);

  useEffect(() => { 
    socket.on('sendMessageToAll', function(message) {
      setListMessage([...listMessage, message])
    });
  }, [listMessage]);

  var handleAdd = () =>{
    socket.emit("sendMessage", {message: currentMessage, pseudo: props.pseudo})
    setCurrentMessage('')
  }

  var listmsg = listMessage.map( (msg, i) => {
    let message = msg.message.replace(/:\)/g, '\u263A') ;
    message = message.replace(/:\(/g , '\u2639') ;
    message = message.replace(/:p/g , '\uD83D\uDE1B') ;
    message = message.replace( /[a-z]*fuck[a-z]*/gi, "\u2022\u2022\u2022" ) ;
    return (
      <ListItem key={i} title={message} subtitle={msg.pseudo}/>
    )
  })

  // console.log(listMessage)

  return (
    <View style={{flex:1}}>
       
        <ScrollView  style={{flex:1, marginTop: 50}}>
          {listmsg}
        </ScrollView>

        <KeyboardAvoidingView enabled>
            <Input
                value={currentMessage}
                containerStyle = {{marginBottom: 5}}
                placeholder='Your message'
                onChangeText={(val) => setCurrentMessage(val)}
            />
            <Button
                icon={
                    <Icon
                    name="envelope-o"
                    size={20}
                    color="#ffffff"
                    />
                } 
                title="Send"
                buttonStyle={{backgroundColor: "#eb4d4b"}}
                type="solid"
                onPress={()=> handleAdd() }
            />
        </KeyboardAvoidingView>
        
    </View>
  );
}

function mapStateToProps(state) {
  return { pseudo: state.pseudo }
}
  
export default connect(
  mapStateToProps, 
  null
)(ChatScreen);