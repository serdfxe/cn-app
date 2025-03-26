import { Button, Divider, Flex, Popover, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

import { DeleteOutlined, LinkOutlined, PlusOutlined } from '@ant-design/icons';

import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

import { deleteBlock, patchBlock } from '../../../../client/notes/block';
import { useNavigate } from 'react-router-dom';
import { EventEmitter } from '../../../../events/events';
import CreateReminderModal from './CreateReminderModal';
import { createReminder } from '../../../../client/reminder/reminder';
import TextContent from '../TextBlock/TextContent';

const PageBlock = ({ block, inline=false }) => {
    const [blockData, setBlock] = useState(block);

    const [isCreateReminderOpen, setIsCreateReminderOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setBlock({...block});
    }, [block])

    useEffect(() => {
        if (inline) {
            return;
        }
        const title = (blockData.properties.emoji ?
            blockData.properties.emoji :
            "📄") + ' ' + (blockData.properties.text ? blockData.properties.text : "Untitled");

        console.log(title);

        document.title = title;
    }, [blockData]);

    const handleRename = () => {
        EventEmitter.emit('updateMenu', {});
    };

    const patchProperties = (props) => {
        blockData.properties = {...blockData.properties, ...props};

        setBlock({...blockData});
    
        patchBlock(block.id, {
            properties: blockData.properties
        })
            .then(data => {
                handleRename();
            })
            .catch((error) => {
                console.log(error);
            })
    }

    if (!blockData) {
        return (
            <></>
        );
    }

    if (inline)
        return (
            <Typography.Link onClick={() => {navigate("/app/page/" + blockData.id)}}>
                <span style={{cursor: 'pointer', margin: "0 8px 0 0", color: "black"}}>
                    {
                        <LinkOutlined />
                    }
                </span>
                <span style={{cursor: 'pointer', margin: "0 8px 0 0"}}>
                    {
                        blockData.properties.emoji ?
                        blockData.properties.emoji :
                        "📄"
                    }
                </span>
                <Typography.Text underline>
                    {
                    blockData.properties.text ?
                    (
                    blockData.properties.text ?
                    blockData.properties.text :
                    "Untitled"
                    ) :
                    "Magic"
                }
                </Typography.Text>
            </Typography.Link>
        );

    return (
        <>
            <h1 style={{paddingLeft: 42, margin: 0, justifyContent: "space-between"}} className='flex align-items-center'>
                <Flex gap="small">
                    <Popover content={
                        <Picker data={data} onEmojiSelect={(e) => patchProperties({emoji: e.native})} locale='ru' noResultsEmoji="page_facing_up" previewPosition="none"/>
                    } title="Выбор эмодзи" trigger="hover" placement="bottomLeft">
                        <span style={{cursor: 'pointer', margin: "4px 0 0 0"}}>
                        {
                            blockData.properties.emoji ?
                            blockData.properties.emoji :
                            "📄"
                        }
                        </span>
                    </Popover>
                    <strong style={{width: '-webkit-fill-available'}}>
                    <Typography.Title style={{width: '-webkit-fill-available', height: 'initial', margin: 0}}>
                        <TextContent block={block} onChange={handleRename}/>
                    </Typography.Title>
                    </strong>
                </Flex>
                <CreateReminderModal 
                    open={isCreateReminderOpen}
                    onCancel={() => setIsCreateReminderOpen(false)}
                    onCreate={(val) => {
                        createReminder(val);
                        setIsCreateReminderOpen(false);
                    }}
                />
                <Flex gap="small">
                    <Button icon={<PlusOutlined />} color="primary" variant="filled" size="large" onClick={() => {setIsCreateReminderOpen(true)}}/>
                    <Button icon={<DeleteOutlined />} color="danger" variant="filled" size="large" onClick={() => {
                        deleteBlock(block.id)
                            .then(data => {
                                handleRename();
                                navigate("/app");
                            })
                            .catch((err) => {
                                console.error(err);
                            });
                    }}/>
                </Flex>
            </h1>
            <Divider />
        </>
    );
};

export default PageBlock;