import React, { useState } from 'react';

import { Typography } from 'antd';
import { patchBlock } from '../../../../client/notes/block';


const TextBlock = ({ block }) => {
    const [textContent, setTextContent] = useState(block.properties.text[0][0]);

    const onChange = (text) => {
        setTextContent(text);

        patchBlock(block.id, {
            properties: {
                ...block.properties,
                text: [[text]],
            }
        })
    }

    return (
        <Typography.Text type={textContent === '' ? 'secondary' : ''} editable={{onChange: onChange, triggerType: ['text']}}>
            {
                textContent === '' ? 
                "Type text..." :
                textContent
            }
        </Typography.Text>
    );
};

export default TextBlock;
