import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import CountriesList from './app/screens/CountriesList';

export default function App() {
    return (
        <View style={styles.container}>
            <CountriesList/>
            <StatusBar style='auto'/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    }
});
