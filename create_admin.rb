#!/usr/bin/env ruby
# frozen_string_literal: true

# Script para crear un usuario administrador en Mastodon
# Uso: ruby create_admin.rb [username] [email]

require_relative 'config/boot'
require_relative 'config/environment'

username = ARGV[0] || 'admin'
email = ARGV[1] || 'admin@localhost'

puts "Creando usuario administrador..."
puts "Username: #{username}"
puts "Email: #{email}"

# Generar una contraseña aleatoria segura
require 'securerandom'
password = SecureRandom.hex(16)

# Obtener el rol de Owner
owner_role = UserRole.find_by(name: 'Owner')

if owner_role.nil?
  puts "Error: No se encontró el rol 'Owner'. Asegúrate de que la base de datos esté correctamente configurada."
  exit 1
end

# Crear la cuenta y el usuario
account = Account.new(username: username)
user = User.new(
  email: email,
  password: password,
  password_confirmation: password,
  agreement: true,
  confirmed_at: Time.now.utc,
  account_attributes: { username: username },
  bypass_registration_checks: true,
  role: owner_role
)

account.suspended_at = nil
user.account = account

if user.save(validate: false)
  user.mark_email_as_confirmed!
  user.approve!

  Setting.site_contact_username = username

  puts "\n" + "="*60
  puts "¡Usuario administrador creado exitosamente!"
  puts "="*60
  puts "Username: #{username}"
  puts "Email: #{email}"
  puts "Contraseña: #{password}"
  puts "\nIMPORTANTE: Guarda esta contraseña de forma segura."
  puts "Puedes cambiarla una vez que inicies sesión."
  puts "="*60
else
  puts "\nError al crear el usuario:"
  user.errors.full_messages.each do |error|
    puts "  - #{error}"
  end
  exit 1
end




