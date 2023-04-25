import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'coolliuzw-markdown-modify',
			name: 'Coolliuzw Markdown Modify',
			editorCallback: markdownModify
		});
	}

	onunload() {

	}
}

function markdownModify(editor: Editor, view: MarkdownView) {
	// 获取当前编辑器的全部文本
	const fullText = editor.getValue();

	// 将 "**修订记录**" 替换为 "## 修订记录"
	// 将 "**名词解释**" 替换为 "## 名词解释"
	let newDataStr = fullText.replace(/\*\*修订记录\*\*/g, '## 修订记录');
	newDataStr = newDataStr.replace(/\*\*名词解释\*\*/g, '## 名词解释');
  
	// 如果文件中没有 [[_TOC_]]，则在 ## 修订记录 之前添加该标记
	if (!newDataStr.includes('[[_TOC_]]')) {
	  newDataStr = newDataStr.replace('## 修订记录', '[[_TOC_]]\n\n## 修订记录');
	}
  
	// 将图片链接转换为相对路径
	const imgRe = /!\[\[(.*)\]\]/g;
	newDataStr = newDataStr.replace(imgRe, (match, imageName) => {
	  imageName = imageName.replace(/ /g, '%20');
	  return `![](resource/img/${imageName})`;
	});

	const imgRe2 = /\!\[(.*)\]\((?<!resource\/img\/)(.*)\)/g;
		newDataStr = newDataStr.replace(imgRe2, (match, desc, link) => {
		const imageName = link.split('/').pop().replace(/ /g, '%20');
		return `![](resource/img/${imageName})`;
	});
  
	 // 将 "## 数字" 标题修改为 "## 大写字母、"
	const re = /^(##\s+)(\d+)\s+(.*)$/gm;
	newDataStr = newDataStr.replace(re, (match, prefix, number, title) => {
		const letter = numToChinese(number);
		title = title.replace(/^\s+/, ''); // 去除最前面的空格
		return `${prefix}${letter}、${title}`;
	});

  
	// 将处理后的文本写回编辑器
	editor.setValue(newDataStr);
}
// 将数字转换为大写字母
function numToChinese(num: number) {
	const words = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
	return words[num - 1];
}