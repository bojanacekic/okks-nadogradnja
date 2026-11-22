import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { profileApi } from '../services/api'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { updateDietaryProfile } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadProfile = () => {
    setLoading(true)
    setError('')
    profileApi.get()
      .then(({ data }) => { setProfile(data); updateDietaryProfile(data) })
      .catch(() => setError('Unable to load your profile. Please try again.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadProfile() }, [])

  const toggleOption = (field, value) => {
    setProfile(current => ({
      ...current,
      [field]: current[field].includes(value)
        ? current[field].filter(option => option !== value)
        : [...current[field], value]
    }))
  }

  const savePreferences = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      const { data } = await profileApi.updatePreferences({
        dietaryPreferences: profile.dietaryPreferences,
        allergens: profile.allergens
      })
      setProfile(data)
      updateDietaryProfile(data)
      toast.success('Preferences saved')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to save your preferences. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>
        {loading ? <p role="status" className="text-gray-500">Loading profile...</p> : error ? (
          <div className="card p-6">
            <p role="alert" className="text-red-600 mb-4">{error}</p>
            <button onClick={loadProfile} className="btn-secondary">Try Again</button>
          </div>
        ) : (
          <form onSubmit={savePreferences} className="space-y-6">
            <div className="card p-6">
              <h2 className="font-semibold text-gray-900">{profile.name}</h2>
              <p className="text-sm text-gray-500 mt-1">{profile.email}</p>
            </div>
            <fieldset disabled={saving} className="card p-6">
              <legend className="font-semibold text-gray-900 px-1">Dietary Preferences</legend>
              <p className="text-sm text-gray-500 mb-4">Select the eating preferences you follow. Leave all unchecked if you have no preferences.</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {profile.preferenceOptions.map(option => (
                  <label key={option} className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={profile.dietaryPreferences.includes(option)}
                      onChange={() => toggleOption('dietaryPreferences', option)} className="accent-orange-500 w-4 h-4" />
                    {option}
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset disabled={saving} className="card p-6">
              <legend className="font-semibold text-gray-900 px-1">Allergens to Avoid</legend>
              <p className="text-sm text-gray-500 mb-4">Select any allergens you need to avoid.</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {profile.allergenOptions.map(option => (
                  <label key={option} className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={profile.allergens.includes(option)}
                      onChange={() => toggleOption('allergens', option)} className="accent-orange-500 w-4 h-4" />
                    {option}
                  </label>
                ))}
              </div>
            </fieldset>
            <button type="submit" disabled={saving} className="btn-primary w-full sm:w-auto">
              {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </form>
        )}
      </main>
    </div>
  )
}
