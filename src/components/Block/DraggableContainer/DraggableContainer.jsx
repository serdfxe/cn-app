import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { HolderOutlined, PlusOutlined, FileTextOutlined, P, AlignLeftOutlined, FileOutlined, CheckSquareOutlined, LineHeightOutlined, MenuUnfoldOutlined, FontSizeOutlined } from '@ant-design/icons';

import classes from '../Block.module.css';
import { Button, Flex, Popover } from 'antd';
import { patchBlock } from '../../../client/notes/block';
import { EventEmitter } from '../../../events/events';


const DraggableContainer = ({ children, onUpdate, ...props }) => {
  const [items, setItems] = React.useState(React.Children.toArray(children));

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const reorderedItems = Array.from(items);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);
    setItems(reorderedItems);

    if (onUpdate) {
      onUpdate(reorderedItems.map((item, i) => item.props.id))
    }
  };

  const types = [
    {
      "type": "text",
      "icon": <AlignLeftOutlined />,
      "title": "Text",
    },
    {
      "type": "h1",
      "icon": <FontSizeOutlined />,
      "title": "Heading 1",
    },
    {
      "type": "h2",
      "icon": <FontSizeOutlined />,
      "title": "Heading 2",
    },
    {
      "type": "h3",
      "icon": <FontSizeOutlined />,
      "title": "Heading 3",
    },
    {
      "type": "quote",
      "icon": <MenuUnfoldOutlined />,
      "title": "Quote",
    },
    {
      "type": "check-box",
      "icon": <CheckSquareOutlined />,
      "title": "Check Box",
    },
    {
      "type": "page",
      "icon": <FileOutlined />,
      "title": "Page",
    },
  ];

  const chooseTypePopover = (id) => (
    <Flex vertical>
      {
        types.map((type, i) =>
          <Button
            key={type.type}
            type="text"
            icon={type.icon}
            style={{
              justifyContent: "flex-start",
            }}
            onClick={() => {
              console.log(id, type.type);

              patchBlock(id, {
                type: type.type,
              })
                .then(resp => {
                  EventEmitter.emit('updateMenu');
                })
            }}
          >{type.title}</Button>
        )
      }
    </Flex>
  );

  const items_memo = items.map((item, index) => {
    return <Draggable key={item.props.id} draggableId={String(item.props.id)} index={index} direcion>
      {(provided) => {
        // let transform = provided.draggableProps.style?.transform

        // if (transform) {
        //     transform = transform.replace(/[-+]*\d+px(?=,\s[-+]*\d+px\))/, "0px");

        //     provided.draggableProps.style = {
        //         ...provided.draggableProps.style,
        //         transform,
        //     }
        // }

        return <div ref={provided.innerRef} {...provided.draggableProps} className={classes.container}>
          <div style={{display: "flex", alignItems: "center"}}>
          <Popover placement="leftTop" content={chooseTypePopover(item.props.id)} trigger="click" overlayStyle={{
            width: "200px",
          }}>
            <PlusOutlined 
              style={{
                cursor: 'pointer',
              }}
              className={classes.dragHandle}
            />
          </Popover>
            <HolderOutlined
              {...provided.dragHandleProps} 
              style={{
                cursor: 'grab',
              }}
              className={classes.dragHandle}
            />
            {item}
          </div>
        </div>
      }}
    </Draggable>}
  )

  return (
    <DragDropContext onDragEnd={onDragEnd} {...props}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className={classes.block_list}>
            {
              items_memo
            }
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableContainer;