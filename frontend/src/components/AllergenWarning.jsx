import { useAuth } from '../context/AuthContext'

export default function AllergenWarning({ allergens }) {
  const { user, dietaryProfile, dietaryProfileError } = useAuth()
  if (!user) return null
  if (dietaryProfileError) return <p className="text-sm text-amber-800 mb-3">Allergen check unavailable. Open your profile to retry.</p>
  if (!dietaryProfile) return <p className="text-sm text-gray-500 mb-3">Checking your allergens...</p>
  if (dietaryProfile.allergens.length === 0) return null
  if (!Array.isArray(allergens)) {
    return <p className="text-sm text-amber-800 bg-amber-50 rounded-lg p-3 mb-3">Allergen information unavailable for this item.</p>
  }
  const matches = allergens.filter(allergen => dietaryProfile.allergens.includes(allergen))
  if (matches.length === 0) return null
  return (
    <p className="text-sm font-medium text-red-800 bg-red-50 rounded-lg p-3 mb-3">
      Contains allergens from your profile — {matches.join(', ')}
    </p>
  )
}
