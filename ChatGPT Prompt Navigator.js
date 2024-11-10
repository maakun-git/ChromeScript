// ==UserScript==
// @name         ChatGPT Prompt Navigator
// @namespace    http://tampermonkey.net/
// @version      2024-11-05
// @description  ChatGPTでユーザーのプロンプト目次を生成し、ジャンプ機能を実現
// @author       You
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        none
// ==/UserScript==


(function() {
    'use strict';
    // サイドメニューの目次リストを作成
    const sidebar = document.createElement("div");
    sidebar.style.position = "fixed";
    sidebar.style.top = "10px";
    sidebar.style.right = "10px";
    sidebar.style.width = "300px";
    sidebar.style.height = "60vh";
    sidebar.style.overflowY = "auto";
    sidebar.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
    sidebar.style.border = "1px solid #ccc";
    sidebar.style.padding = "10px";
    sidebar.style.zIndex = "9999";
    sidebar.style.fontSize = "14px";
    sidebar.innerHTML = "<strong>Prompt Navigator</strong><br>";
    sidebar.style.cursor = 'move';

    // トグルボタンの作成
    const toggleButton = document.createElement("button");
    toggleButton.textContent = "Sidebar";
    toggleButton.style.position = "fixed";
    toggleButton.style.top = "10px";
    toggleButton.style.left = "420px";
    toggleButton.style.zIndex = "10000";
    toggleButton.style.padding = "5px 10px";
    toggleButton.style.cursor = "pointer";

    // トグルボタンのクリックイベント
    toggleButton.addEventListener("click", () => {
        if (sidebar.style.display === "none") {
            sidebar.style.display = "block";
        } else {
            sidebar.style.display = "none";
        }
    });

    // ページに追加
    document.body.appendChild(sidebar);
    document.body.appendChild(toggleButton);

    // プロンプトを検索して目次を作成
    function updatePromptList() {
        // サイドバーをクリア
        sidebar.innerHTML = "<strong>Prompt Navigator</strong><br>";

        // ChatGPTのプロンプト部分のクラス名を指定して取得
        //const promptSelector = "div[data-message-author-role='user']";
        // ChatGPTのプロンプト部分のクラス名
        const promptSelector = ".whitespace-pre-wrap";

        const prompts = document.querySelectorAll(promptSelector);

        //console.log(prompts)

        prompts.forEach((prompt, index) => {
            // プロンプトにIDを付与してリンクを作成
            const id = `prompt-${index}`;
            prompt.setAttribute("id", id);

            // 目次アイテムを作成してサイドバーに追加
            const link = document.createElement("a");
            const dispLength = 25;
            link.href = `#${id}`;
            //const textContent = prompt.querySelector(".whitespace-pre-wrap")?.innerText || "";
            const textContent = prompt.innerText;
            link.textContent = `${index + 1}: ` + textContent.substring(0, dispLength);
            if(dispLength < textContent.length){
                link.textContent += "...";
            }
            link.style.display = "block";
            link.style.marginBottom = "5px";
            // マウスオーバー時にテキスト全体が表示されるようにtitle属性を設定
            link.title = prompt.innerText;
            // Add hover effect for links
            link.addEventListener('mouseover', () => { link.style.textDecoration = 'underline'; } );
            link.addEventListener('mouseout', () => { link.style.textDecoration = 'none' } );
            sidebar.appendChild(link);
        });
    }

    // 初期ロードとプロンプト追加時にリストを更新
    let currentLength = 0;
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                //const promptSelector = "div[data-message-author-role='user']";
                const promptSelector = ".whitespace-pre-wrap";
                const prompts = document.querySelectorAll(promptSelector);
                if (0 < prompts.length && currentLength != prompts.length) {
                    currentLength = prompts.length;
                    //console.log(prompts);
                    updatePromptList();
                }
            }
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // URL変更を監視してサイドバーを再構築
    window.addEventListener('popstate', () => {
        console.log("URLが変更されました。サイドバーを再構築します。");
        updatePromptList();
    });

    // Make the sidebar draggable
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    sidebar.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initialLeft = sidebar.offsetLeft;
        initialTop = sidebar.offsetTop;
        sidebar.style.cursor = 'grabbing';
        e.preventDefault(); // Prevents text selection
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            sidebar.style.left = `${initialLeft + dx}px`;
            sidebar.style.top = `${initialTop + dy}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        sidebar.style.cursor = 'move';
    });
})();
