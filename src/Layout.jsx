import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import { routes } from '@/config/routes'

const Layout = () => {
  const location = useLocation()
  const visibleRoutes = Object.values(routes).filter(route => !route.hidden)

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Bottom Navigation */}
      <nav className="flex-shrink-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-inset-bottom">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {visibleRoutes.map((route) => {
            const isActive = location.pathname === route.path
            
            return (
              <NavLink
                key={route.id}
                to={route.path}
                className="flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 relative"
              >
                {({ isActive: navIsActive }) => (
                  <>
                    {navIsActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-primary/10 rounded-lg"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    <div className="relative z-10 flex flex-col items-center">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ApperIcon
                          name={route.icon}
                          size={24}
                          className={`transition-colors duration-200 ${
                            navIsActive ? 'text-primary' : 'text-gray-500'
                          }`}
                        />
                      </motion.div>
                      <span className={`text-xs mt-1 transition-colors duration-200 font-medium ${
                        navIsActive ? 'text-primary' : 'text-gray-500'
                      }`}>
                        {route.label}
                      </span>
                    </div>
                  </>
                )}
              </NavLink>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

export default Layout