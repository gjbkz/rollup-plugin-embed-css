Promise.all([
    import('./set'),
    import('./style4.css'),
])
.then(([{set}, style4]) => {
    document.body.classList.add(style4.className.element4);
    const rootStyle = getComputedStyle(document.documentElement);
    const bodyStyle = getComputedStyle(document.body);
    set({
        root1: rootStyle.getPropertyValue('--style1'),
        root2: rootStyle.getPropertyValue('--style2'),
        root3: rootStyle.getPropertyValue('--style3'),
        root4: rootStyle.getPropertyValue('--style4'),
        class1: bodyStyle.getPropertyValue('--name1'),
        class2: bodyStyle.getPropertyValue('--name2'),
        class3: bodyStyle.getPropertyValue('--name3'),
        class4: bodyStyle.getPropertyValue('--name4'),
    });
})
.catch(console.error)
.finally(() => {
    document.title = 'Done';
});
