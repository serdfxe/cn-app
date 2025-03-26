import React, { useEffect, useState } from 'react';
import { SettingOutlined, UserOutlined, InboxOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Flex, Menu } from 'antd';

import { NavLink, useNavigate, useParams } from 'react-router-dom';

import { createBlock, getBlock, patchBlock } from '../../../client/notes/block';
import { getWorkspace } from '../../../client/notes/workspace';
import { EventEmitter } from '../../../events/events';

const WorkSpaceMenu = () => {
  const [reloadState, setReloadState] = useState(true);
  const [workspace, setWorkspace] = useState(null);
  const [items, setItems] = useState([]);
  const { pageId } = useParams();

  const navigate = useNavigate();

  const createPage = () => {
    createBlock({
      type: 'page',
      properties: {
        text: [[""]],
        emoji: "📄",
      },
      content: [],
      parent: workspace.id,
    })
      .then(
        data => {
          const new_content = [
            ...workspace.content,
            data.id,
          ]
            patchBlock(workspace.id, {
              content: new_content
            })
              .then(data => {
                console.log(workspace);
                
                workspace.content = new_content;

                let new_ws_data = workspace;

                setWorkspace({
                  id: new_ws_data.id,
                  type: new_ws_data.type,
                  properties: new_ws_data.properties,
                  content: new_content,
                  parent_id: new_ws_data.parent_id,
                });

                handleUpdateMenu();
              })
        }
      )
      .catch(err => console.log(err));
  }

  const generateItems = async (data) => {
    const item = {
      key: data.id,
      icon: <div>{data.properties.emoji ? data.properties.emoji : "📄"}</div>,
      label: data.type === "page" ? (<a onClick={() => navigate("/app/page/" + data.id, {
        state: {
          pageId: data.id,
        }
      })}>{data.properties.text[0][0] === "" ? 'Untitled' : data.properties.text[0][0]}</a>) : "",
      children: [],
    };

    if (data.content && data.content.length > 0) {
      for (const contentId of data.content) {
        let child = undefined;
        
        try {
          child = await getBlock(contentId);
        } catch (error) {
          continue;
        }

        if (child.type != 'page') {
          continue;
        }

        const childItem = await generateItems(child);

        item.children.push(childItem);
      }
    }

    if (data.type === 'workspace') {
      const add_button = {
        key: data.id,
        icon: <PlusCircleOutlined />,
        label: <a onClick={createPage}>New Page</a>,
        children: null,
      };
  
      item.children.push(add_button)
    }

    if (item.children.length === 0) {
      item.children = null;
    }

    return item;
  };

  const handleUpdateMenu = () => {
    setReloadState(!reloadState);
  }

  EventEmitter.subscribe('updateMenu', handleUpdateMenu);

  useEffect(() => {
    getWorkspace()
      .then(
        data => {
          setWorkspace(data);
        })
  }, [reloadState])

  useEffect(() => {
    const load = async () => {
      if (workspace === null || workspace === undefined) {
        return;
      }

      const data_in_json = await generateItems(workspace);

      const children = data_in_json.children;

      setItems([
        {
          key: 'main-group',
          label: 'Memorandum',
          type: 'group',
          children: [
            {
              key: 'account',
              icon: <UserOutlined />,
              label: <NavLink to='/app/account'>Account</NavLink>,
            },
            {
              key: 'inbox',
              icon: <InboxOutlined />,
              label: <NavLink to='/app/inbox'>Inbox</NavLink>,
            },
            {
              key: 'settings',
              icon: <SettingOutlined />,
              label: <NavLink to='/app/settings'>Settings</NavLink>,
            }
          ]
        },
        {
          key: 'workspace-group',
          label: 'Workspace',
          type: 'group',
          children: children
        }
      ]);
    }

    load();
  }, [workspace]);

  const getLevelKeys = (items1) => {
    const key = {};
    const func = (items2, level = 1) => {
      items2.forEach((item) => {
        if (item.key) {
          key[item.key] = level;
        }
        if (item.children) {
          func(item.children, level + 1);
        }
      });
    };
    func(items1);
    return key;
  };
  
  const [stateOpenKeys, setStateOpenKeys] = useState([pageId]);

  const onOpenChange = (openKeys) => {
    const levelKeys = getLevelKeys(items);
    const currentOpenKey = openKeys.find((key) => stateOpenKeys.indexOf(key) === -1);
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);
      setStateOpenKeys(
        openKeys
          .filter((_, index) => index !== repeatIndex)
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey]),
      );
    } else {
      setStateOpenKeys(openKeys);
    }
  };

  return (
    <Flex vertical>
      <Menu
        mode="inline"
        label="Workspaces"
        openKeys={stateOpenKeys}
        onOpenChange={onOpenChange}
        style={{
          width: 256,
          height: "-webkit-fill-available",
        }}
        items={items}
      />
    </Flex>
  );
};

export default WorkSpaceMenu;