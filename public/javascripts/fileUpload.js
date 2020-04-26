const rootSytles = window.getComputedStyle
(document.documentElement)

//we do the check to know if we are ready to use getproperty value
// bcz if not we need to add an event listener that will load main.css
if(rootSytles.getPropertyValue
('--book-cover-width-large') != null &&
rootSytles.getPropertyValue
('--book-cover-width-large') != '') {
    ready()
} else {
    //here we check if main-css is loaded because 
    //when it is we have access to rootStyles
    document.getElementById('main-css').addEventListener('load', ready)
}

function ready() {
// the code will execute when the function is ready and the container able to upload images
//register the plugins that we will use first
    //do check to dynamically know if we can get values
    const coverWidth = parseFloat(rootSytles.getPropertyValue
    ('--book-cover-width-large'))
    const coverAspectRation = parseFloat(rootSytles.getPropertyValue
    ('--book-cover-aspect-ration'))
    const coverHeight = coverWidth / coverAspectRation
    FilePond.registerPlugin(
        FilePondPluginImagePreview,
        FilePondPluginImageResize,
        FilePondPluginFileEncode,
    )

    FilePond.setOptions({
        stylePanelAspectRatio: 1 / coverAspectRation, // file pond expect the inverse of our aspect ratio
        imageResizeTargetWidth: coverWidth,
        imageResizeTargetHeight: coverHeight
    })

    //Here i parse the files to Base String 64 so that the server understands them
    FilePond.parse(document.body);
}
  