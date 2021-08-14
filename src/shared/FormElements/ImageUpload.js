import React, { useRef, useState, useEffect } from 'react'

import Button from './Button'
import './ImageUpload.css'

const ImageUpload = (props) => {
    const [file, setFile] = useState()
    //url for preview image
    const [prevUrl, setPrevUrl] = useState(props.image)
    const [isValid, setIsValid] = useState(false)

    //reference for upload button
    const filePickerRef = useRef()

    //Generating preview
    useEffect(() => {
        if (!file) {
            return
        }
        //generating image preview url
        const fileReader = new FileReader()
        //execute when fileReader loads new files, or is done parsing file, function execute when reading file is done
        fileReader.onload = () => {
            //setting url for image
            setPrevUrl(fileReader.result)
        }
        fileReader.readAsDataURL(file)
    }, [file])

    //Opening hidden file input element
    const uploadImageHandler = () => {
        filePickerRef.current.click()
    }


    //Preview file
    const UploadedImageHandler = (e) => {
        let pickedFile
        let fileIsValid = isValid


        //Check if we have files in hidden input element
        if (e.target.files && e.target.files.length === 1) {

            let file = e.target.files[0]

            const reader = new FileReader();



            //store file into picked file variable
            pickedFile = e.target.files[0]
            setFile(pickedFile)
            setIsValid(true)
            fileIsValid = true
            reader.onload = res => {
                props.onInput(props.id, res.target.result, fileIsValid)
            };
            reader.readAsDataURL(file);
        } else {
            setIsValid(false)
            fileIsValid = false
            props.onInput(props.id, null, fileIsValid)

        }
    }

    return (
        <div className="form-control">
            <input
                ref={filePickerRef}
                id={props.id}
                style={{ display: 'none' }}
                type="file"
                accept=".jpg, .png, .jpeg, .svg, .gif"
                onChange={UploadedImageHandler} />
            <div className={`image-upload ${props.center && 'center'}`}>

                <div className="image-upload__preview">
                    {prevUrl && <img width={props.width} src={prevUrl} alt="Previrew" />}
                    {!prevUrl && <p>Choose image</p>}
                </div>
                <Button type="button" onClick={uploadImageHandler}>UPLOAD IMAGE</Button>
            </div>
            {!isValid && <p>{props.errorText}</p>}
        </div>
    )
}

export default ImageUpload