import React from 'react'
import { User } from '../interfaces/User'

const AppContext = React.createContext<User>(null)

export default AppContext
