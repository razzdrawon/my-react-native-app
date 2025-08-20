import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useBluetooth } from '../hooks/useBluetooth';

const BluetoothDataTransfer: React.FC = () => {
  const { connectedDevice } = useBluetooth();
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);

  const sendMessage = async () => {
    if (!connectedDevice) {
      Alert.alert('Error', 'No device connected');
      return;
    }

    if (!message.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    try {
      // This is a simplified example - in real implementation you'd need to:
      // 1. Discover services
      // 2. Discover characteristics
      // 3. Write to the appropriate characteristic
      
      Alert.alert('Info', `Message "${message}" would be sent to ${connectedDevice.name}`);
      
      // Add message to sent list
      setReceivedMessages(prev => [...prev, `Sent: ${message}`]);
      setMessage('');
      
    } catch (error) {
      Alert.alert('Error', `Failed to send message: ${error}`);
    }
  };

  const startListening = async () => {
    if (!connectedDevice) {
      Alert.alert('Error', 'No device connected');
      return;
    }

    try {
      setIsListening(true);
      Alert.alert('Info', `Started listening for data from ${connectedDevice.name}`);
      
      // In real implementation, you would:
      // 1. Discover services
      // 2. Discover characteristics
      // 3. Subscribe to notifications
      // 4. Listen for data changes
      
    } catch (error) {
      Alert.alert('Error', `Failed to start listening: ${error}`);
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    try {
      setIsListening(false);
      Alert.alert('Info', 'Stopped listening for data');
      
      // In real implementation, you would:
      // 1. Unsubscribe from notifications
      // 2. Remove listeners
      
    } catch (error) {
      Alert.alert('Error', `Failed to stop listening: ${error}`);
    }
  };

  const clearMessages = () => {
    setReceivedMessages([]);
  };

  if (!connectedDevice) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDeviceText}>
          Please connect to a Bluetooth device first
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Data Transfer</Text>
        <Text style={styles.deviceInfo}>
          Connected to: {connectedDevice.name}
        </Text>
      </View>

      {/* Send Message Section */}
      <View style={styles.sendSection}>
        <Text style={styles.sectionTitle}>Send Message</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={message}
            onChangeText={setMessage}
            placeholder="Enter your message..."
            multiline
            numberOfLines={3}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Listen Section */}
      <View style={styles.listenSection}>
        <Text style={styles.sectionTitle}>Listen for Data</Text>
        <View style={styles.buttonContainer}>
          {!isListening ? (
            <TouchableOpacity style={styles.listenButton} onPress={startListening}>
              <Text style={styles.listenButtonText}>Start Listening</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.stopButton} onPress={stopListening}>
              <Text style={styles.stopButtonText}>Stop Listening</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Messages Section */}
      <View style={styles.messagesSection}>
        <View style={styles.messagesHeader}>
          <Text style={styles.sectionTitle}>Messages</Text>
          <TouchableOpacity style={styles.clearButton} onPress={clearMessages}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.messagesContainer}>
          {receivedMessages.length === 0 ? (
            <Text style={styles.noMessagesText}>No messages yet</Text>
          ) : (
            receivedMessages.map((msg, index) => (
              <View key={index} style={styles.messageItem}>
                <Text style={styles.messageText}>{msg}</Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  deviceInfo: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  noDeviceText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 100,
  },
  sendSection: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    fontSize: 16,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  listenSection: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  listenButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  listenButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  stopButton: {
    backgroundColor: '#F44336',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  stopButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  messagesSection: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  messagesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clearButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  messagesContainer: {
    flex: 1,
  },
  noMessagesText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  messageItem: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  messageText: {
    fontSize: 14,
    color: '#333',
  },
});

export default BluetoothDataTransfer; 