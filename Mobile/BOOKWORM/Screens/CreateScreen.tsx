import {View, Text,StyleSheet,KeyboardAvoidingView,Platform,StatusBar, ScrollView, TextInput, TouchableOpacity, Image,ActivityIndicator,Alert} from 'react-native';
import {useState} from 'react';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from'@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_URL} from '@/Constants/api';

export default function CreateScreen(){
    const [title,setTitle] =useState('');
    const [caption, setCaption] = useState('');
    const [rating, setRating] = useState(3);
    const [image, setImage] =useState();;
    const [imageBase64, setImageBase64] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const insets = useSafeAreaInsets();


    const renderRating = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)} style={Styles.starButton}>
          <Ionicons
            name={i <= rating ? "star" : "star-outline"}
            size={32}
            color={i <= rating ? "#f4b400" : 'grey'}
          />
        </TouchableOpacity>
      );
    }
    return <View style={Styles.ratingContainer}>{stars}</View>;
  };
    const  imagePicker = () =>{
        ImagePicker.openPicker({
            width:400,
            height:200,
            cropping:true,
            includeBase64:true,
        }).then(image =>{ 
            const data = `data:${image.mime};base64,${image.data}`
            setImage(data);
        }).catch(err =>{
            if(ImagePicker.isCancel(err)){
                return ;
            }
            console.log('Image Picker Error:', err);
        })
    }
    const handleCreateBook = async() =>{

        if(!title || !caption || !rating || !image){
            return Alert.alert("Error","Please fill in all fields");
        }
        console.log("pressed");
        const token = await AsyncStorage.getItem('token')
        console.log(token)
        const bookData={
            title:title,
            caption:caption,
            rating:rating.toString(),
            image:image,
        }
        axios.post(`${API_URL}/createbook`,bookData,{
            headers:{
                Authorization: `Bearer ${token}`,
                "Content-Type" : "application/json"
            }
        })
        .then((res)=>{
            console.log(res.data)
            if(res.data.status === 'ok'){
                setTitle("");
                setCaption("");
                setRating(3);
                setImage(null);
                setImageBase64(null);
            }else{
                Alert.alert("Error","Failed to create book recommendation")
                console.log(JSON.stringify(res.data))
            }
        })
        .catch(e => console.log(e))

    }
    return(
        <KeyboardAvoidingView
            behavior = {Platform.OS === 'ios' ?'padding' :'height'}
        >
        <ScrollView style={{marginHorizontal:20,paddingTop:insets.top}}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff"/>
            <View style={Styles.card}>
                <View style={{alignItems:'center',marginBottom:24}}>
                    <Text style={{color:'#4caf50',fontSize:24,fontFamily: "JetBrainsMono-Medium",marginBottom:8,fontWeight:'700'}}>Add Book Recommendation</Text>
                    <Text  style={{fontSize:14,color:'#688f68'}}>Share your favorite reads with others</Text>
                </View>
                <View style={Styles.form}>
                    <View style={Styles.grpform}>
                        <Text style={Styles.text}>Book Title</Text>
                        <View style={Styles.inputcontainer}>
                            <Ionicons
                                name="book-outline"
                                size={20}
                                color={'#4caf50'}
                                style={Styles.icon}
                            />
                            <TextInput
                                placeholder="Enter book title"
                                placeholderTextColor='#767676'
                                value={title}
                                onChangeText={setTitle}
                                autoCapitalize='none'
                                style={Styles.inputplace}
                            />
                        </View>
                    </View>
                    <View>
                        <View style={Styles.grpform}>
                            <Text style={Styles.text}>Your Rating</Text>
                            {renderRating()}
                        </View>
                    </View>
                    <View>
                        <View style={Styles.grpform}>
                            <Text style={Styles.text}>Book Image</Text>
                            <TouchableOpacity style={Styles.imagePicker}
                                onPress={imagePicker}
                            >
                                { image ? (
                                    <Image
                                        source={{uri:image}}
                                        style={{width:'100%',height:'100%'}}
                                    />
                                ) :(
                                    <View style={{alignItems:'center',justifyContent:'center',height:'100%',width:'100%'}}>
                                        <Ionicons
                                        name="image-outline"
                                        size={40}
                                        color={'#4caf50'}
                                        />
                                        <Text>Tap to select image</Text>
                                    </View>
                                    )
                                }
                            </TouchableOpacity>
                        </View>
                    </View>
                     <View style={Styles.grpform}>
                        <Text style={Styles.text}>Caption</Text>
                        <TextInput
                            placeholder="Write your review or thoughts about this book....."
                            placeholderTextColor='#767676'
                            value={caption}
                            onChangeText={setCaption}
                            autoCapitalize='none'
                            style={Styles.caption}
                            multiline
                            />
                    </View>
                    <TouchableOpacity
                        onPress={() =>handleCreateBook()}
                        disabled={isLoading}
                        style={Styles.button}
                    >
                        {isLoading ? <ActivityIndicator color='#fff'/> :
                        <>
                                <Ionicons
                                    name="cloud-upload-outline"
                                    size={20}
                                    color={'white'}
                                />
                            <Text style={Styles.textbutton}>Share</Text>
                        </>
                            
                        }
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
        </KeyboardAvoidingView>
    )
}

const Styles = StyleSheet.create({
    card:{
        borderWidth:1,
        padding:20,
        borderRadius:15
    },
    form:{

    },
    grpform:{
        marginBottom:15
    },
    text:{
        fontWeight:'bold',
        marginBottom:5
    },
    inputcontainer:{
        flexDirection:'row',
        alignItems:'center',
        borderWidth:1,
        borderColor:'#4caf50',
        borderRadius:5,
        padding:5,
        gap:5
    },
    inputplace:{

    },
    icon:{
        marginLeft:5
    },
    ratingContainer:{
        flexDirection:'row',
        alignItems:'center',
        borderWidth:1,
        borderColor:'#4caf50',
        borderRadius:5,
        padding:10,
        gap:5
        
    },
    imagePicker: {
    width: "100%",
    height: 200,
    backgroundColor:'',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4caf50',
    overflow: "hidden",
  },
  caption:{
    justifyContent:'flex-start',
    height:100,
    padding:12,
    borderRadius:12,
    borderWidth: 1,
    borderColor: '#4caf50',

  },
  button:{
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#4caf50',
        padding:10,
        borderRadius:10,
        marginBottom:20,
        flexDirection:'row',
        gap:5
    },
    textbutton:{
        color:'white',
        fontSize:16
    },
      starButton: {
    padding: 8,
  },
})