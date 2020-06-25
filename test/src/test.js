Promise.all([
    import('./set'),
    import('./style4.css'),
])
.then(([{set}, style4]) => {
    const style = getComputedStyle(document.documentElement);
    set(
        {
            'style1': style.getPropertyValue('--style1'),
            'style2': style.getPropertyValue('--style2'),
            'style3': style.getPropertyValue('--style3'),
            'style4': style.getPropertyValue('--style4'),
        },
        style4,
    );
})
.catch(console.error)
.finally(() => {
    document.title = 'Done';
});
