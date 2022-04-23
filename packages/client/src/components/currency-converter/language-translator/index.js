import React from 'react';
import { Select,Typography } from 'antd';
import USFlag from './../../../images/flags/us.svg';
import GermanFlag from './../../../images/flags/germany.svg';
import FrenchFlag from './../../../images/flags/france.svg';
import DenmarkFlag from './../../../images/flags/denmark.svg';
import SpainFlag from './../../../images/flags/spain.svg';
import Finnlandlag from './../../../images/flags/finland.svg';
import Italianlag from './../../../images/flags/italy.svg';
import JapaneseFlag from './../../../images/flags/japan.svg';
import NetherlandsFlag from './../../../images/flags/netherlands.svg';
import SwedanFlag from './../../../images/flags/sweden.svg';
const { Option } = Select;
const{Text}=Typography;

export default function (props) {
    return (
        <div className='language-translator-body'>
            <Select
                showSearch
                style={{ width: 150, display: 'flex', alignItems: 'center' }}
                value={props.language}
                optionFilterProp="children"
                onChange={props.handleLanguageChange}
                filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                
            >
                <Option value="en"><img src={USFlag} alt="USA" className='language-translator-flag-img'/><Text>English</Text></Option>
                <Option value="de"><img src={GermanFlag} alt="Germany" className='language-translator-flag-img'/><Text>German</Text></Option>
                <Option value="fr"><img src={FrenchFlag} alt="France" className='language-translator-flag-img'/><Text>French</Text></Option>
                <Option value="da"><img src={DenmarkFlag} alt="Denmark" className='language-translator-flag-img'/><Text>Danish</Text></Option>
                <Option value="es"><img src={SpainFlag} alt="Spain" className='language-translator-flag-img'/><Text>Spanish</Text></Option>
                <Option value="fi"><img src={Finnlandlag} alt="Finnland" className='language-translator-flag-img'/><Text>Finnish</Text></Option>
                <Option value="it"><img src={Italianlag} alt="Italy" className='language-translator-flag-img'/><Text>Italian</Text></Option>
                <Option value="ja"><img src={JapaneseFlag} alt="Japan" className='language-translator-flag-img'/><Text>Japanese</Text></Option>
                <Option value="nl"><img src={NetherlandsFlag} alt="Netherlands" className='language-translator-flag-img'/><Text>Dutch</Text></Option>
                <Option value="sv"><img src={SwedanFlag} alt="Swedan" className='language-translator-flag-img'/><Text>Swedish</Text></Option>
            </Select>
        </div>
    )
}