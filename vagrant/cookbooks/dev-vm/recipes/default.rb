# Making apache run as the vagrant user simplifies things when you ssh in
node.set["apache"]["user"] = "vagrant"
node.set["apache"]["group"] = "vagrant"

require_recipe "apt"

require_recipe "apache2"
require_recipe "apache2::mod_rewrite"
require_recipe "apache2::mod_ssl"

package "git-core"

# Remove the 000-default site
apache_site "000-default"

web_app "localhost" do
  server_name "localhost"
  server_aliases ["*.localhost", "33.33.33.30"]
  docroot "/home/vagrant/app"
end

gem_package "compass" do
  action :install
  version "0.11.5"
  provider Chef::Provider::Package::Rubygems
end

# Add the vagrant user to the vboxsf group
group "vboxsf" do
  members 'vagrant'
  append true
end