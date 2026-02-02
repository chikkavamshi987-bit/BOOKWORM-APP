import {View, Text,StatusBar, Image, TextInput,StyleSheet, Alert, TouchableOpacity, ActivityIndicator,KeyboardAvoidingView,Platform, ScrollView} from 'react-native';
import React from 'react';
import {useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {useDispatch} from  'react-redux';
import {loginSuccess} from '@/redux/userSlice';
import {login} from '@/redux/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@/Constants/api';

export default function Login(){
    const insets = useSafeAreaInsets();
    const [email, setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [showPassword, setShowPassword] =useState(false);
    const [isLoading,setIsLoading]=useState(false);
    const navigation = useNavigation();
    const dispatch=useDispatch();
    function handleLogin(){
        const userData={
            email:email,
            password:password
        }
        axios.post(`${API_URL}/login`,userData)
        .then((res)=>{
            if(res.data.status === 'ok'){
                dispatch(loginSuccess({
                    _id:res.data.data.oldUser._id,
                    name:res.data.data.oldUser.name,
                    email:res.data.data.oldUser.email,
                    mobile:res.data.data.oldUser.mobile,
                    profile:res.data.data.oldUser.Profile,
                    createdAt:res.data.data.oldUser.createdAt
            }));
                AsyncStorage.setItem('token',res.data.data.token);
                AsyncStorage.setItem('isLoggedIn',JSON.stringify(true))
                dispatch(login())
                navigation.navigate('HomeTab')
            }else{

                Alert.alert(JSON.stringify(res.data))
            }
        }).catch((e)=>console.log(e))

    }
    return(
        <KeyboardAvoidingView
            style={{paddingTop:insets.top,flex:1,backgroundColor:'#fff'}}
            behavior ={Platform.OS === 'ios' ? 'padding' :'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 :20}
        >
        <ScrollView
            contentContainerStyle={{flexGrow:1}}
            keyboardShouldPersistTaps='handled'
        >
        <View>
            <StatusBar barStyle='dark-content'/>
            <View style={{
                alignItems:'center',marginVertical:110
            }}>
                <Image
                    source={require('@/assets/images/i.png')}
                    style={{
                        width:'90%',
                        height:170,
                    }}
                />
            </View>
            <View style={Styles.boxShadow}>
                <View style={Styles.innerContainer}>
                    <View>
                        <Text style={Styles.text}>Email</Text>
                        <View style={Styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color={'#4CAF50'}/>
                        <TextInput
                            placeholder="Enter your email"
                            placeholderTextColor={'#767676'}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            style={{flex:1}}
                            autoCapitalize="none"
                        />
                    </View>
                    </View>
                    <View >
                        <Text style={Styles.text}>Password</Text>
                        <View style={Styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color={'#4caf50'}/>
                        <TextInput
                            placeholder="Enter your password"
                            placeholderTextColor={'#767676'}
                            value= {password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            style={{flex:1,color:'black'}}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Ionicons
                                name={showPassword ?"eye-outline" : "eye-off-outline"}
                                size={20}
                                color={'#4caf50'}
                            />
                        </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={()=>handleLogin()}
                        disabled={isLoading}
                        style={Styles.button}
                    >
                        {isLoading ? <ActivityIndicator color='#fff'/> :
                            <Text style={Styles.textbutton}>Login</Text>
                        }
                    </TouchableOpacity>
                    <View style={{flexDirection:'row',justifyContent:'center'}}>
                        <Text>Don't have an account?</Text>
                        <TouchableOpacity
                            onPress={()=>navigation.navigate('Register')}
                        >
                            <Text style={{color:'#4caf50'}}> Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>  
            </View>  
        </View>
        </ScrollView>
    </KeyboardAvoidingView>
    )
}
const Styles = StyleSheet.create({
    boxShadow:{
        
    },
    innerContainer:{
        marginHorizontal:20,
        padding:20,
        borderRadius:20,
        borderWidth:1,
        gap:15,
    },
    inputContainer:{
        flexDirection:'row',
        alignItems:'center',
        gap:5,
        borderWidth:1,
        padding:5,
        borderRadius:10,
        borderColor:'#c8e6c9',
    },
    text:{
        fontWeight:'bold',
        marginBottom:5
    },
    button:{
        alignItems:'center',
        backgroundColor:'#4caf50',
        padding:10,
        borderRadius:10,
    },
    textbutton:{
        color:'white',
        fontSize:16
    }
})