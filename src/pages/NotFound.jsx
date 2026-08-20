/*
 * Copyright 2025 Krishna GSVV
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-9xl font-bold mb-4 bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
          404
        </h1>

        <h2 className="text-3xl font-semibold mb-6">Page Not Found</h2>

        <p className="text-lg mb-8 text-gray-400">
          Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>

        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-200 mr-4"
          >
            Go Home
          </Link>

          <Link
            to="/projects"
            className="inline-block border-2 border-primary-500/60 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-500/10 transition-colors duration-200"
          >
            View Projects
          </Link>
        </div>

        <div className="mt-12 text-gray-500">
          <p className="text-sm">
            If you think this is an error, please{" "}
            <Link to="/contact" className="underline hover:text-white">
              contact me
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
