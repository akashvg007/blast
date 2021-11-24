import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Modal, Portal, Text, Provider } from 'react-native-paper';

const CustomModal = ({ show, data }) => {
    const [visible, setVisible] = useState(show);
    const hideModal = () => setVisible(false);
    const containerStyle = { backgroundColor: 'white', padding: 20 };

    return (
        <Portal>
            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                {
                    Object.keys(data).map(key => (
                        <Text key={key} style={styles.text}>{data[key]}</Text>
                    ))
                }
            </Modal>
        </Portal>
    );
};

export default CustomModal;

const styles = StyleSheet.create({
    text: {
        flexDirection: 'row',
        width: '100%'
    }
})