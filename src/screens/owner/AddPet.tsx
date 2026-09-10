import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

export function AddPet() {
  const { addPet } = useApp()
  const nav = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState('')
  const [breed, setBreed] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [fixed, setFixed] = useState(true)
  const [photoDataUrl, setPhotoDataUrl] = useState('')
  const [error, setError] = useState('')

  function onPhotoPick(file: File | undefined) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      setPhotoDataUrl(result)
      setError('')
    }
    reader.readAsDataURL(file)
  }

  function save() {
    setError('')
    if (!name.trim()) {
      setError('Name is required.')
      return
    }
    const created = addPet({
      name,
      breed,
      height,
      weight,
      fixed,
      photoDataUrl,
    })
    if (!created) {
      setError('Could not save pet.')
      return
    }
    nav('/owner')
  }

  return (
    <div className="screen">
      <header className="screen-head">
        <button type="button" className="back" onClick={() => nav('/owner')}>
          ← Back
        </button>
        <h1>Add pet</h1>
        <p className="muted">Photo and basics for Your pets on Home.</p>
      </header>

      <div className="pet-photo-field">
        <button
          type="button"
          className="pet-photo-picker"
          onClick={() => fileRef.current?.click()}
          aria-label="Upload or take pet photo"
        >
          {photoDataUrl ? (
            <img src={photoDataUrl} alt="" className="pet-photo-preview" />
          ) : (
            <span className="pet-photo-placeholder">
              <span className="pet-photo-plus">📷</span>
              <span className="muted small">Upload / camera</span>
            </span>
          )}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          onChange={(e) => onPhotoPick(e.target.files?.[0])}
        />
        {photoDataUrl ? (
          <button
            type="button"
            className="link-btn"
            onClick={() => setPhotoDataUrl('')}
          >
            Remove photo
          </button>
        ) : null}
      </div>

      <label className="field">
        <span>Name</span>
        <input
          type="text"
          required
          placeholder="Scout"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="off"
        />
      </label>

      <label className="field">
        <span>Breed</span>
        <input
          type="text"
          placeholder="Border Collie"
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
          autoComplete="off"
        />
      </label>

      <div className="field-row">
        <label className="field">
          <span>Height</span>
          <input
            type="text"
            placeholder="20 in"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            autoComplete="off"
          />
        </label>
        <label className="field">
          <span>Weight</span>
          <input
            type="text"
            placeholder="38 lb"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            autoComplete="off"
          />
        </label>
      </div>

      <div className="field">
        <span>Fixed / not fixed</span>
        <div className="seg">
          <button
            type="button"
            className={fixed ? 'on' : ''}
            onClick={() => setFixed(true)}
          >
            Fixed
          </button>
          <button
            type="button"
            className={!fixed ? 'on' : ''}
            onClick={() => setFixed(false)}
          >
            Not fixed
          </button>
        </div>
      </div>

      {error ? (
        <p className="hint field-error" role="alert">
          {error}
        </p>
      ) : null}

      <button type="button" className="btn primary block" onClick={save}>
        Save
      </button>
    </div>
  )
}
