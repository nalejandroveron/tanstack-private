#!/bin/bash

# Check if at least one argument is provided
if [ $# -lt 2 ]; then
  echo "To generate a Tanstack Start Route: $0 route <route without .tsx> (For route definitions, see https://tanstack.com/router/v1/docs/framework/react/routing/file-based-routing)"
  echo "To generate a Drizzle Table: $0 table <tableName>"
  echo "To generate a UI Component: $0 component <componentName> (name or path, without extension)"
  echo "To generate a Lib: $0 lib <componentName> (name or path, without extension)"
  echo "To generate a Service: $0 service <componentName> (name or path, without extension)"
  exit 1
fi

ensure_tsx_extension() {
  local filename="$1"
  echo "${filename%.*}.tsx"
}

ensure_ts_extension() {
  local filename="$1"
  echo "${filename%.*}.ts"
}

ensure_index_tsx() {
  local filename="$1"

  if [[ "$filename" == */index.tsx ]]; then
    echo "$filename"
    return
  fi

  # Remove extension if present
  filename="${filename%.*}/index.tsx"

  echo "$filename"
}

get_directory_path() {
  local filepath="$1"

  # Remove "/index.tsx" if present
  if [[ "$filepath" == */index.tsx ]]; then
    filepath="${filepath%/index.tsx}"
  else
    # Remove the filename to get just the directory path
    filepath="${filepath%/*}"
  fi

  echo "$filepath"
}


get_folder_or_filename() {
  local filename="$1"

  # Remove the trailing "/index.tsx" if present
  filename="${filename%/index.tsx}"

  # Extract the last part of the path
  filename="${filename##*/}"

  # Capitalize the first letter
  echo "$(tr '[:lower:]' '[:upper:]' <<< "${filename:0:1}")${filename:1}"
}


# Function to check if a file exists and fail if it does
ensure_file_not_exists() {
  local filepath="$1"

  if [[ -e "$filepath" ]]; then
    echo "Error: File '$filepath' already exists."
    exit 1  # Immediately exit script on failure
  fi
}

open_in_editor() {
  local filepath="$1"

  # Determine the editor to use
  if [[ -n "$EDITOR" ]]; then
    local editor="$EDITOR"
  elif command -v code &>/dev/null; then
    local editor="code"
  else
    local editor="vim"
  fi

  # Open the file
  "$editor" "$filepath"
}


command=$1
variable=$2

case "$command" in
  route)
    filename=$(ensure_tsx_extension "app/routes/$variable")
    ensure_file_not_exists "$filename"
    touch $filename
    open_in_editor "$filename"
    ;;
  component)
    filename=$(ensure_index_tsx "app/components/$variable")
    dirpath=$(get_directory_path "$filename")
    mkdir -p $dirpath
    ensure_file_not_exists "$filename"
    touch $filename
    component_name=$(get_folder_or_filename "$filename")
    npx --yes @getgrit/cli apply "codegen_component(componentName=\"$component_name\")" "$filename" --force
    open_in_editor "$filename"
    ;;
  table)
    filename=$(ensure_ts_extension "db/$variable")
    index_file="db/index.ts"
    npx --yes @getgrit/cli apply "codegen_table(tableName=\"$variable\", tableFile=\"$filename\")" "$index_file" --force
    open_in_editor "$filename"
    ;;
  lib)
    filename=$(ensure_ts_extension "app/lib/$variable")
    ensure_file_not_exists "$filename"
    touch $filename
    open_in_editor "$filename"
    ;;
  service)
    filename=$(ensure_ts_extension "services/$variable")
    ensure_file_not_exists "$filename"
    touch $filename
    open_in_editor "$filename"
    ;;
  *)
    echo "Error: Unknown command '$command'. Available commands: route, component, table, lib, service."
    exit 1
    ;;
esac