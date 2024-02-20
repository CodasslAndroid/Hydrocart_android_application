import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {CommonHeader} from '../../components';
import {policyPageApi} from '../../services/api';
import {FontSize, color, typography} from '../../theme';
import {Divider, Loader} from '../../ui-kit';

export const PoliciesPages = ({route}) => {
  const {title, slug, screen} = route?.params ?? {};
  const [policyData, setPolicyData] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const payload = new FormData();
    payload.append('slug', slug);
    policyPageApi()
      .then(res => {
        setLoading(false);
        setPolicyData(res?.page[0]);
        console.log('res', res);
      })
      .catch(err => {
        setLoading(false);
        console.log('err', err);
      });
  }, [slug]);

  return (
    <View style={{backgroundColor: color.palette.white, flex: 1}}>
      <CommonHeader
        title={title}
        // settingIcon={true}
        // setDelModal={setDelModal}
      />
      <Divider />
      <ScrollView>
        {loading ? (
          <Loader style={styles.loaderTxt} />
        ) : (
          <View>
            <Text style={styles.text}>{policyData?.page_content}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  text: {
    fontFamily: typography.primary,
    fontSize: FontSize.font_medium_E,
    color: color.palette.black,
    marginHorizontal: 20,
    marginTop: 20,
  },
  loaderTxt: {marginTop: 30},
});
