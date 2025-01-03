from julia.api import Julia
from julia import Main
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def initialize_julia():
    try:
        # Initialize Julia
        logger.info("Initializing Julia...")
        jl = Julia(compiled_modules=False)

        # Ensure required packages are installed
        logger.info("Ensuring required Julia packages are installed...")
        Main.eval("""
        import Pkg

        # Check if a package is installed
        function is_installed(pkg::String)
            return any(p.name == pkg for p in Pkg.dependencies())
        end

        # List of required packages
        required_packages = ["CSV", "DataFrames", "JuMP", "GLPK", "Dates"]
        
        # Install missing packages
        for pkg in required_packages
            if !is_installed(pkg)
                try
                    Pkg.add(pkg)
                catch e
                    @warn "Failed to install package $pkg" exception=e
                end
            end
        end
        
        # Build GLPK in case it isn't built
        if is_installed("GLPK")
            try
                Pkg.build("GLPK")
            catch e
                @warn "Failed to build GLPK" exception=e
            end
        end
        """)

        # Include Julia scripts
        logger.info("Including Julia scripts...")
        Main.include(r"C:\\Users\\alexr\\OneDrive\\Documents\\GitHub\\Battery-Technology\\Julia\\energySavings.jl")
        Main.include(r"C:\\Users\\alexr\\OneDrive\\Documents\\GitHub\\Battery-Technology\\Julia\\Ch_DisCh.jl")
        Main.include(r"C:\\Users\\alexr\\OneDrive\\Documents\\GitHub\\Battery-Technology\\Julia\\batteryTest.jl")
        Main.include(r"C:\\Users\\alexr\\OneDrive\\Documents\\GitHub\\Battery-Technology\\Julia\\batteryFunction.jl")
        Main.include(r"C:\\Users\\alexr\\OneDrive\\Documents\\GitHub\\Battery-Technology\\Julia\\batteryDeg.jl")

        logger.info("Julia initialized successfully.")
        return Main
    except Exception as e:
        logger.error(f"Failed to initialize Julia: {e}", exc_info=True)
        raise RuntimeError(f"Failed to initialize Julia: {e}")
