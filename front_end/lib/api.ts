/**
 * Configuration et utilitaires pour l'API backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://105.96.71.28:9001/api'

export interface Catalogue {
  id: number
  nom: string | null
  fichier_pdf: string
  fichier_pdf_url: string
  actif: boolean
  ordre: number
  date_creation: string
  date_modification: string
}

export interface ProduitFournisseur {
  id: number
  nom: string
  image: string
  image_url: string
  catalogues?: Catalogue[]
  actif: boolean
  ordre: number
  date_creation: string
  date_modification: string
}

export interface SousFamille {
  id: number
  famille_id: number
  partenaire_id: number | null
  titre_fr: string
  titre_en: string
  titre_ar: string
  produits_fournisseur?: ProduitFournisseur[]
  actif: boolean
  ordre: number
  date_creation: string
  date_modification: string
}

export interface Famille {
  id: number
  titre_fr: string
  titre_en: string
  titre_ar: string
  sous_familles: SousFamille[]
  actif: boolean
  ordre: number
  date_creation: string
  date_modification: string
}

export interface Partenaire {
  id: number
  nom: string
  logo: string
  logo_url: string
  url_site_web: string
  familles?: Famille[]
  actif: boolean
  date_creation: string
  date_modification: string
}

export interface PartenairesResponse {
  count: number
  next: string | null
  previous: string | null
  results: Partenaire[]
}

export interface Produit {
  id: number
  titre_fr: string
  titre_en: string
  titre_ar: string
  image_couverture: string
  image_couverture_url: string
  description_fr: string
  description_en: string
  description_ar: string
  partenaires?: Partenaire[]
  actif: boolean
  ordre: number
  date_creation: string
  date_modification: string
}

export interface ProduitsResponse {
  count: number
  next: string | null
  previous: string | null
  results: Produit[]
}

/**
 * Récupère tous les partenaires actifs depuis le backend
 */
export async function getPartenairesActifs(): Promise<Partenaire[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/partenaires/actifs/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Ajouter cache pour améliorer les performances
      next: { revalidate: 60 }, // Revalider toutes les 60 secondes
    })

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }

    const data: PartenairesResponse = await response.json()
    return data.results || []
  } catch (error) {
    console.error('Erreur lors de la récupération des partenaires:', error)
    // Retourner un tableau vide en cas d'erreur pour éviter de casser l'UI
    return []
  }
}

/**
 * Récupère tous les partenaires (actifs et inactifs)
 */
export async function getAllPartenaires(): Promise<Partenaire[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/partenaires/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }

    const data: PartenairesResponse = await response.json()
    return data.results || []
  } catch (error) {
    console.error('Erreur lors de la récupération des partenaires:', error)
    return []
  }
}

/**
 * Récupère un partenaire par son ID
 */
export async function getPartenaireById(id: number): Promise<Partenaire | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/partenaires/${id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Erreur lors de la récupération du partenaire ${id}:`, error)
    return null
  }
}

/**
 * Récupère tous les produits actifs depuis le backend
 */
export async function getProduitsActifs(): Promise<Produit[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/produits/actifs/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 }, // Revalider toutes les 60 secondes
    })

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }

    const data: ProduitsResponse = await response.json()
    return data.results || []
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error)
    return []
  }
}

/**
 * Récupère tous les produits (actifs et inactifs)
 */
export async function getAllProduits(): Promise<Produit[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/produits/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }

    const data: ProduitsResponse = await response.json()
    return data.results || []
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error)
    return []
  }
}

/**
 * Récupère un produit par son ID
 */
export async function getProduitById(id: number): Promise<Produit | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/produits/${id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Erreur lors de la récupération du produit ${id}:`, error)
    return null
  }
}

/**
 * Récupère une sous-famille par son ID avec ses produits fournisseur
 */
export async function getSousFamilleById(id: number): Promise<SousFamille | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/sous-familles/${id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Erreur lors de la récupération de la sous-famille ${id}:`, error)
    return null
  }
}

