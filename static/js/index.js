(function () {
    /**
     * 类型判断
     * @type {Object}
     */
    let UtilType = {
        isPrototype: function( data ) {
            return Object.prototype.toString.call(data).toLowerCase();
        },

        isJSON: function( data ) {
            return this.isPrototype( data ) === '[object object]';
        },

        isFunction: function( data ) {
            return this.isPrototype( data ) === '[object function]';
        }
    }

    /**
     * form表单上传请求事件
     * @param  {object} options 请求参数
     */
    function requestEvent( options ) {
        try {
            let formData = options.formData
            let xhr = new XMLHttpRequest()
            xhr.onreadystatechange = function() {
                if ( xhr.readyState === 4 && xhr.status === 200 ) {
                    options.success(JSON.parse(xhr.responseText))
                }
            }
            xhr.upload.onprogress = function(evt) {
                let loaded = evt.loaded
                let tot = evt.total
                let per = Math.floor(100 * loaded / tot)
                options.progress(per)
            }
            xhr.upload.onerror = function(err) {
                options.fail(err)
            }
            xhr.open('post', '/api/picture/upload.json')
            xhr.send(formData)
        } catch ( err ) {
            options.fail(err)
        }
    }

    /**
     * 上传事件
     * @param  {object} options 上传参数
     */
    function uploadEvent ( options ) {
        if ( !UtilType.isJSON( options ) ) {
            console.log( 'upload options is null' )
            return
        }
        let file
        let formData = new FormData()
        let input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('name', 'files')
        input.click()
        input.onchange = function () {
            file = input.files[0]
            formData.append('files', file)
            requestEvent({
                formData,
                success: UtilType.isFunction(options.success) ? options.success : function() {},
                fail: UtilType.isFunction(options.fail) ? options.fail : function() {},
                progress: UtilType.isFunction(options.progress) ? options.progress : function() {}
            })
        }
    }

    let btn = document.getElementById('J_UploadPictureBtn')
    let progressElem = document.getElementById('J_UploadProgress')
    let previewElem = document.getElementById('J_PicturePreview')

    btn.addEventListener('click', function(){
        uploadEvent({
            success: function( result ) {
                console.log( result )
                if ( result && result.success && result.data && result.data.pictureUrl ) {
                    previewElem.innerHTML = '<img src="'+ result.data.pictureUrl +'" style="max-width: 100%">'
                }
            },
            progress: function( data ) {
                if ( data && data * 1 > 0 ) {
                    progressElem.innerText = data
                }
            },
            fail(err) {
                previewElem.innerText(err)
            }
        })
    })
})()