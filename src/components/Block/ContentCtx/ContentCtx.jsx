import React, { useEffect, useState } from 'react';
import Block from '../Block';
import DraggableContainer from '../DraggableContainer/DraggableContainer';

import { Button } from 'antd';
import { createBlock } from '../../../client/notes/block';

const ContentCtx = ({ block, onUpdate, inline=false }) => {
    const [blockData, setBlockData] = useState(block);
    
    useEffect(() => {
        setBlockData(block);
    }, [block]);

    const newBlock = () => {
        createBlock({
            parent: block.id,
            type: 'text',
            properties: { text: [['']] },
            content: [],
        })
            .then(data => {
                const newBlockData = {
                    ...blockData
                };

                setBlockData(newBlockData);
            })
    }

    return (
        <div className='flex column'>
            <div key={blockData.id + blockData.content} style={blockData.type !== "page" && blockData.type !== "workspace" ? {} : {marginTop: -12}} id={"block-container-" + block.id}>
                <DraggableContainer onUpdate={onUpdate}>
                    {   
                        !blockData.content ?
                        null :
                        blockData.content.map((data, i) => <Block id={data} key={data} inline={inline}/>)
                    }
                </DraggableContainer>
            </div>
            {
                blockData.type !== "page" && blockData.type !== "workspace" ?
                null :
                <Button icon="+" style={{'width': "auto", marginTop: '24px', marginLeft: "55px"}} type='dashed' onClick={newBlock}/>
            }
        </div>
    );
};

export default ContentCtx;