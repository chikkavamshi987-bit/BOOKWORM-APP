import { Ionicons } from '@expo/vector-icons';
import {Text,TouchableOpacity,StyleSheet,Alert} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {userlogout} from '@/redux/userSlice';
import {logout} from '@/redux/authSlice'
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

export default function LogoutButton(){
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const dologout = async() =>{
        AsyncStorage.multiRemove(['token','isLogged']);
        dispatch(userlogout());
        dispatch(logout());}
    const confirmLogout = () =>{
        Alert.alert('Logout',"Are you sure you want to logout?",[
            {text:"Cancel" , style:"cancel"},
            {text:"Logout" ,onPress: dologout , style:"destructive"}
        ])
    }
    return(
        <TouchableOpacity
            style={Styles.logoutbutton}
            onPress={()=> confirmLogout()}
        >   
        <Ionicons name="log-out-outline" size={20} color={'white'}/>
            <Text style={Styles.textbutton}>Logout</Text>
        </TouchableOpacity>
    )
}

const Styles = StyleSheet.create({
    logoutbutton:{
        flexDirection:'row',
        justifyContent:'center',
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