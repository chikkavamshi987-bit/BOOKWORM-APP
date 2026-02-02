import {View, Text, StatusBar, KeyboardAvoidingView,Platform ,StyleSheet,TextInput,TouchableOpacity,ActivityIndicator,Alert, ScrollView} from 'react-native';
import React from 'react';
import {useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {API_URL} from '@/Constants/api';

export default function Register(){
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const [name,setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword]= useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [mobile, setMobile] = useState('');
    const [isLoading, setIsLoading]=useState(false);
    function handleSignUp(){
        const userData={
            name:name,
            email:email,
            mobile:mobile,
            password:password
        }
        console.log('pressed')
        axios.post(`${API_URL}/register`,userData)
             .then((res)=>{
                console.log(res.data);
                if(res.data.status === 'ok'){
                    navigation.navigate('Login');
                    Alert.alert("Register Successfully!!");
                }else{
                    Alert.alert(JSON.stringify(res.data))
                }
             })
             .catch((e)=> console.log(e))
    }
    return(
        <KeyboardAvoidingView
            style={{paddingTop:insets.top,flex:1,backgroundColor:'#fff'}}
            behavior = {Platform.OS === 'ios' ? 'padding' :'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            <ScrollView
                contentContainerStyle={{flexGrow:1}}
                keyboardShouldPersistTaps='handled'
            >
                <StatusBar barStyle='dark-content' />
                <View style={Styles.outerContainer}>
                        <View style={Styles.header}>
                            <Text style={{color:'#4caf50',fontSize:32,fontFamily: "JetBrainsMono-Medium",marginBottom:8,fontWeight:'bold'}}>BookWorm🐛</Text>
                            <Text style={{fontSize:16,color:'#688f68'}}>Share your favorite reads</Text>
                        </View>
                        <View style={Styles.inputgroup}>
                            <View>
                                <Text style={Styles.text}> Username</Text>
                                <View style={Styles.inputContainer}>
                                    <Ionicons
                                        name="person-outline"
                                        size={20}
                                        color={'#4caf50'}
                                        style={Styles.icon}
                                    />
                                    <TextInput
                                        placeholder="John Doe"
                                        placeholderTextColor="#767676"
                                        value={name}
                                        onChangeText={setName}
                                        style={{}}
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>
                            <View>
                                <Text style={Styles.text}>Email</Text>
                                <View style={Styles.inputContainer}>
                                    <Ionicons
                                        name="mail-outline"
                                        size={20}
                                        color={'#4caf50'}
                                        style={Styles.icon}
                                    />
                                    <TextInput
                                        placeholder="johndoe@gmail.com"
                                        placeholderTextColor="#767676"
                                        value={email}
                                        onChangeText={setEmail}
                                        style={{}}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>
                            <View>
                                <Text style={Styles.text}>Mobile</Text>
                                <View style={Styles.inputContainer}>
                                    <Ionicons
                                        name="phone-portrait-outline"
                                        size={20}
                                        color={'#4caf50'}
                                        style={Styles.icon}
                                    />
                                    <TextInput
                                        placeholder="0123456789"
                                        placeholderTextColor="#767676"
                                        value={mobile}
                                        onChangeText={setMobile}
                                        style={{}}
                                        keyboardType="number-pad"
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
                                    style={{flex:1}}
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
                        </View> 
                    <TouchableOpacity
                        onPress={handleSignUp}
                        disabled={isLoading}
                        style={Styles.button}
                    >
                        {isLoading ? <ActivityIndicator color='#fff'/> :
                            <Text style={Styles.textbutton}>Sign Up</Text>
                        }
                    </TouchableOpacity>
                    <View style={{flexDirection:'row',justifyContent:'center'}}>
                        <Text style={{color:'#688f68'}}>Already have an account?</Text>
                        <TouchableOpacity
                            onPress={()=>navigation.navigate('Login')}
                        >
                            <Text style={{color:'#4caf50'}}> Login</Text>
                        </TouchableOpacity>
                    </View>    
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const Styles = StyleSheet.create({
    header:{
        alignItems:'center',
        marginBottom:32
    },
    outerContainer:{
        marginTop:100,
        padding:20,
        borderWidth:1,
        borderRadius:20,
        marginHorizontal:20
    },
    inputContainer:{
        flexDirection:'row',
        alignItems:'center',
        borderWidth:1,
        padding:5,
        borderRadius:10,
        gap:5,
        borderColor:'#c8e6c9'

    },
    icon:{
        marginLeft:5
    },
    text:{
        fontWeight:'bold',
        marginBottom:5
    },
    inputgroup:{
        marginBottom:20,
        gap:10
    },
    button:{
        alignItems:'center',
        backgroundColor:'#4caf50',
        padding:10,
        borderRadius:10,
        marginBottom:20
    },
    textbutton:{
        color:'white',
        fontSize:16
    }
})