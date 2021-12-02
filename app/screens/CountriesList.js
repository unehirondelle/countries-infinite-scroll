import React, {useEffect, useState} from 'react';
import {createServer} from 'miragejs';
import {View, Text, SafeAreaView, FlatList, StatusBar, StyleSheet, ActivityIndicator, Dimensions} from 'react-native';
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

const {width, height} = Dimensions.get('window');

const CountriesList = () => {
    const [countries, setCountries] = useState([]);
    const [offsetNumber, setOffsetNumber] = useState(0);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);

    const fetchData = () => {
        console.log(`offsetNumber: ${offsetNumber}, countries: ${countries}`);
        if (countries.length < 40) {
            fetch(`/api/countries?offset=${offsetNumber}&limit=20`)
                .then(res => res.json())
                .then(json => {
                    if (json.length) {
                        offsetNumber === 0 ?
                            setCountries(json)
                            : setCountries([...countries, ...json]);
                        setIsPageLoading(false);
                        setIsLoading(false);
                        setIsRefreshing(false);
                    } else {
                        window.alert('No more countries');
                    }
                })
                .catch(err => {
                    setIsPageLoading(false);
                    console.log(`/api/countries error ${err}`)
                });
        }
    };

    useEffect(() => {
        fetchData();
    }, [isRefreshing, isLoading]);

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

    const handleEndReached = ({distanceFromEnd}) => {
        if (countries.length < 40) {
            console.log('onEndReached', distanceFromEnd)
            if (distanceFromEnd <= 0 && !hasScrolled) {
                console.log('didnt reach to the end of the list')
                return;
            }
            if (isPageLoading) {
                console.log('already loading')
                return;
            }
            setOffsetNumber(current => current + 20);
            setIsLoading(true);
            console.log('end reached');
        }
    };

    const handleRefresh = () => {
        if (countries.length < 40) {
            setOffsetNumber(0);
            setIsRefreshing(true);
        } else {
            setHasScrolled(false);
        }
    };

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
                <FlatList contentContainerStyle={{
                    flex: 1,
                    flexDirection: 'column',
                    height: '100%',
                    width: '100%'
                }} data={countries} renderItem={renderItem} keyExtractor={item => item.name}
                          onScroll={(e) => {
                              console.log('SCROLL', e);
                              setHasScrolled(true)
                          }}
                          onEndReached={handleEndReached}
                          onEndReachedThreshold={0.5}
                          onRefresh={handleRefresh}
                          // refreshing={isRefreshing}
                          refreshing={isPageLoading}
                          ListFooterComponent={renderFooter}
                          initialNumToRender={20}
                          onMomentumScrollBegin={(e) => {
                              console.log('onMomentumScrollBegin', e);
                              setIsPageLoading(true);
                          }}
                          onMomentumScrollEnd={() => {
                              console.log('onMomentumScrollEnd');
                          }}

                />
                : <View>
                    <Text style={{alignSelf: 'center'}}>Loading data</Text>
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
