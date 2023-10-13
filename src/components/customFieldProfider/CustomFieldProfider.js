import React from 'react';
import {TouchableOpacity} from 'react-native';
import GlobalText from '../globalText';
import {useSelector} from 'react-redux';
import GlobalModal from '../modal/GlobalModal';
import GlobalButton from '../button/GlobalButton';

const CustomFieldProvider = () => {
  const provider = useSelector(
    state => state.orderReducer.dataBasket?.product?.provider,
  );
  const [activeModal, setActiveModal] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const onOpenModal = async options => {
    await setOptions(options);
    await setActiveModal(true);
  };

  const closeModal = () => setActiveModal(false);

  return (
    <>
      {provider?.customFields?.map((field, index) => (
        <TouchableOpacity
          onPress={() => onOpenModal(field?.options || [])}
          key={index}>
          <GlobalText>{field?.name}</GlobalText>
        </TouchableOpacity>
      ))}
      <GlobalModal closeModal={closeModal} isVisible={activeModal}>
        {options.map((option, index) => (
          <TouchableOpacity key={index}>
            <GlobalText>{option}</GlobalText>
          </TouchableOpacity>
        ))}
        <GlobalButton title="Save" />
      </GlobalModal>
    </>
  );
};

export default CustomFieldProvider;
