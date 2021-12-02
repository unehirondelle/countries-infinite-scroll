import React, {useEffect, useState} from 'react';
import {createServer} from 'miragejs';
import {View, Text, SafeAreaView, FlatList, StatusBar, StyleSheet, ActivityIndicator} from 'react-native';
import countriesData from '../data/countries';

if (window.server) {
    server.shutdown();
}

window.server = createServer({
    routes() {
        this.get(`/api/countries`, (schema, request) => {
            const {offset, limit} = request.queryParams;
            return countriesData.slice(offset, parseInt(offset) + parseInt(limit));
        });
    }
});

const CountriesList = () => {
    const [countries, setCountries] = useState([]);
    const [offsetNumber, setOffsetNumber] = useState(0);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchData = () => {
        fetch(`/api/countries?offset=${offsetNumber}&limit=20`)
            .then(res => res.json())
            .then(json => {
                if (json.length) {
                    setCountries(current => current.concat(json));
                    setIsPageLoading(false);
                    setIsLoading(false);
                    setIsRefreshing(false);
                } else {
                    window.alert('No more countries');
                }
            })
            .catch(err => console.log(`/api/countries error ${err}`));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const ListItem = ({name}) => (
        <View style={styles.item}>
            <Text style={styles.title}>
                {name}
            </Text>
        </View>
    );

    const renderItem = ({item}) => {
        return <ListItem name={item.name}/>
    };

    const handleEndReached = () => {
        setIsLoading(true);
        setOffsetNumber(offsetNumber + 20);
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchData();
    };
    /*const onEndReachedHandler = ({distanceFromEnd}) => {
        if (!isLoading) {
            setOffsetNumber(offsetNumber + 20)
            setIsLoading(true)
        }
    };
*/

    const renderFooter = () => {
        if (!isLoading) return null;

        return (
            <View
                style={{
                    position: 'relative',
                    width: 50,
                    height: 50,
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    marginTop: 10,
                    marginBottom: 10,

                }}
            >
                <ActivityIndicator animating size="large"/>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {!isPageLoading ?
                <FlatList data={countries} renderItem={renderItem} keyExtractor={item => item.name}
                          onEndReached={handleEndReached}
                          onEndReachedThreshold={0.5}
                          onRefresh={handleRefresh}
                          refreshing={isRefreshing}
                          ListFooterComponent={renderFooter}/>
                : <View>
                    <Text style={{alignSelf: 'center'}}>Loading beers</Text>
                    <ActivityIndicator/>
                </View>
            }
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    },
});

export default CountriesList;
