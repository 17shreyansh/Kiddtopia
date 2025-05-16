import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align'; // For text alignment
import HorizontalRule from '@tiptap/extension-horizontal-rule'; // For horizontal rule
import Blockquote from '@tiptap/extension-blockquote'; // For blockquote
import {
    BoldOutlined, ItalicOutlined, StrikethroughOutlined,
    OrderedListOutlined, UnorderedListOutlined, UndoOutlined, RedoOutlined,
    FileImageOutlined, FontSizeOutlined,
    AlignCenterOutlined, AlignLeftOutlined, AlignRightOutlined, // Alignment icons
    CommentOutlined, // Using for blockquote
    MinusOutlined, // Using for horizontal rule
} from '@ant-design/icons';
import { Button, Space, Divider, Tooltip, Dropdown, Menu, message } from 'antd';
import { uploadEditorImage } from '../services/api';
import './RichTextEditor.css';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL; // e.g., http://localhost:5001

const MenuBar = ({ editor }) => {
    
    const addImage = useCallback(() => {
        if (!editor) return ;
        
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async () => {
            if (input.files?.length) {
                const file = input.files[0];
                const formData = new FormData();
                formData.append('editorImage', file);

                try {
                    message.loading({ content: 'Uploading image...', key: 'editorImageUpload', duration: 0 });
                    const response = await uploadEditorImage(formData);
                    if (response.success && response.data.imageUrl) {
                        // response.data.imageUrl is like '/uploads/blogs/image.jpg'
                        const fullImageUrl = API_BASE_URL + response.data.imageUrl;
                        editor.chain().focus().setImage({ src: fullImageUrl }).run();
                        message.success({ content: 'Image uploaded!', key: 'editorImageUpload', duration: 2 });
                    } else {
                        message.error({ content: response.message || 'Image upload failed.', key: 'editorImageUpload', duration: 2 });
                    }
                } catch (error) {
                    message.error({ content: error.message || 'Image upload failed.', key: 'editorImageUpload', duration: 2 });
                }
            }
        };
        input.click();
    }, [editor]);

     if (!editor) return null;


    const headingMenu = (
        <Menu onClick={({ key }) => {
            if (key === "0") {
                editor.chain().focus().setParagraph().run();
            } else {
                editor.chain().focus().toggleHeading({ level: parseInt(key, 10) }).run();
            }
        }}>
            <Menu.Item key="1">Heading 1</Menu.Item>
            <Menu.Item key="2">Heading 2</Menu.Item>
            <Menu.Item key="3">Heading 3</Menu.Item>
            <Menu.Item key="0">Paragraph</Menu.Item>
        </Menu>
    );

    const textAlignMenu = (
        <Menu onClick={({ key }) => editor.chain().focus().setTextAlign(key).run()}>
            <Menu.Item key="left" icon={<AlignLeftOutlined />}>Left</Menu.Item>
            <Menu.Item key="center" icon={<AlignCenterOutlined />}>Center</Menu.Item>
            <Menu.Item key="right" icon={<AlignRightOutlined />}>Right</Menu.Item>
            {/* <Menu.Item key="justify" icon={<MenuOutlined />}>Justify</Menu.Item>  Tiptap supports justify */}
        </Menu>
    );


    const menuItems = [
        { icon: <BoldOutlined />, action: () => editor.chain().focus().toggleBold().run(), isActive: editor.isActive('bold'), tooltip: 'Bold' },
        { icon: <ItalicOutlined />, action: () => editor.chain().focus().toggleItalic().run(), isActive: editor.isActive('italic'), tooltip: 'Italic' },
        { icon: <StrikethroughOutlined />, action: () => editor.chain().focus().toggleStrike().run(), isActive: editor.isActive('strike'), tooltip: 'Strike' },
        { type: 'dropdown', icon: <FontSizeOutlined />, tooltip: 'Text Size / Heading', overlay: headingMenu, isActive: editor.isActive('heading') },
        { type: 'dropdown', icon: <AlignLeftOutlined />, tooltip: 'Text Align', overlay: textAlignMenu, isActive: editor.isActive({ textAlign: 'left' }) || editor.isActive({ textAlign: 'center' }) || editor.isActive({ textAlign: 'right' }) },
        { type: 'divider' },
        { icon: <UnorderedListOutlined />, action: () => editor.chain().focus().toggleBulletList().run(), isActive: editor.isActive('bulletList'), tooltip: 'Bullet List' },
        { icon: <OrderedListOutlined />, action: () => editor.chain().focus().toggleOrderedList().run(), isActive: editor.isActive('orderedList'), tooltip: 'Ordered List' },
        { icon: <CommentOutlined />, action: () => editor.chain().focus().toggleBlockquote().run(), isActive: editor.isActive('blockquote'), tooltip: 'Blockquote' },
        { icon: <MinusOutlined />, action: () => editor.chain().focus().setHorizontalRule().run(), tooltip: 'Horizontal Rule' },
        { type: 'divider' },
        { icon: <FileImageOutlined />, action: addImage, tooltip: 'Insert Image' },
        { type: 'divider' },
        { icon: <UndoOutlined />, action: () => editor.chain().focus().undo().run(), tooltip: 'Undo', disabled: !editor.can().undo() },
        { icon: <RedoOutlined />, action: () => editor.chain().focus().redo().run(), tooltip: 'Redo', disabled: !editor.can().redo()  },
    ];

    return (
        <Space wrap className="editor-menubar">
            {menuItems.map((item, index) => {
                if (item.type === 'divider') return <Divider key={index} type="vertical" style={{ margin: '0 6px' }} />;
                if (item.type === 'dropdown') {
                    return (
                        <Tooltip title={item.tooltip} key={index}>
                            <Dropdown overlay={item.overlay} trigger={['click']}>
                                <Button icon={item.icon} type={item.isActive ? 'primary' : 'default'} />
                            </Dropdown>
                        </Tooltip>
                    );
                }
                return (
                    <Tooltip title={item.tooltip} key={index}>
                        <Button
                            icon={item.icon}
                            onClick={item.action}
                            type={item.isActive ? 'primary' : 'default'}
                            disabled={item.disabled}
                        />
                    </Tooltip>
                );
            })}
        </Space>
    );
};

const RichTextEditor = ({ value, onChange }) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
                code: false,
                codeBlock: false,
                horizontalRule: false, // Disable StarterKit's default to use the dedicated extension
                blockquote: false, // Disable StarterKit's default
            }),
            Image.configure({ inline: false, allowBase64: false }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }), // Apply text align to headings and paragraphs
            HorizontalRule, // Use the dedicated extension
            Blockquote, // Use the dedicated extension
        ],
        content: value, // Initial content
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: { class: 'tiptap-editor-field' },
        },
    });

    // Effect to update editor content when `value` prop changes (e.g., loading initialData)
    React.useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            // Only update if the prop value is different from current editor content
            // This check helps prevent infinite loops or unnecessary re-renders.
            editor.commands.setContent(value, false); // `false` means don't emit update event
        }
    }, [value, editor]);


    return (
        <div className="rich-text-editor-container">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
};

export default RichTextEditor;