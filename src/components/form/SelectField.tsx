import React, { useState, useMemo } from 'react'
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import { Controller } from 'react-hook-form'
import {
  TextInput,
  Text,
  useTheme,
  Modal,
  Portal,
  Button,
  Checkbox,
  Chip,
} from 'react-native-paper'

type Option = {
  label: string
  value: string
}

type Props = {
  control: any
  name: string
  label: string
  options: Option[]
  multiple?: boolean
  searchable?: boolean
}

export const SelectField = ({
  control,
  name,
  label,
  options,
  multiple = false,
  searchable = false,
}: Props) => {
  const theme = useTheme()
  const [visible, setVisible] = useState(false)
  const [search, setSearch] = useState('')

  const filteredOptions = useMemo(() => {
    if (!searchable || search.trim() === '') return options
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    )
  }, [search, options, searchable])

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const selectedValues = multiple ? (value || []) : value
        const selectedLabels = multiple
          ? options
              .filter((opt) => selectedValues?.includes(opt.value))
              .map((o) => o.label)
              .join(', ')
          : options.find((opt) => opt.value === value)?.label || ''

        return (
          <View style={styles.container}>
            {/* Select Input */}
            <TouchableOpacity onPress={() => setVisible(true)}>
              <TextInput
                mode="outlined"
                label={label}
                value={multiple ? undefined : selectedLabels}
                editable={false}
                pointerEvents="none"
                error={!!error}
                right={<TextInput.Icon icon="menu-down" />}
              />
            </TouchableOpacity>

            {/* 🔹 Chip Preview for Multi Select */}
            {multiple && value?.length > 0 && (
              <View style={styles.chipContainer}>
                {options
                  .filter((opt) => selectedValues.includes(opt.value))
                  .map((opt) => (
                    <Chip
                      key={opt.value}
                      style={{ marginRight: 8, marginBottom: 8 }}
                      onClose={() =>
                        onChange(selectedValues.filter((v: string) => v !== opt.value))
                      }
                      icon="check"
                    >
                      {opt.label}
                    </Chip>
                  ))}
              </View>
            )}

            {error && (
              <Text style={{ color: theme.colors.error, marginTop: 4 }}>
                {error.message}
              </Text>
            )}

            {/* 🔽 Modal Dropdown */}
            <Portal>
              <Modal
                visible={visible}
                onDismiss={() => setVisible(false)}
                contentContainerStyle={[
                  styles.modalContainer,
                  { backgroundColor: theme.colors.background },
                ]}
              >
                <Text variant="titleMedium" style={{ marginBottom: 12 }}>
                  {label}
                </Text>

                {/* Search */}
                {searchable && (
                  <TextInput
                    mode="outlined"
                    placeholder="Search..."
                    value={search}
                    onChangeText={setSearch}
                    style={{ marginBottom: 12 }}
                  />
                )}

                {/* Option List */}
                <FlatList
                  data={filteredOptions}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => {
                    const selected = multiple
                      ? selectedValues?.includes(item.value)
                      : selectedValues === item.value

                    return (
                      <TouchableOpacity
                        onPress={() => {
                          if (multiple) {
                            const newValues = selected
                              ? selectedValues.filter((v: string) => v !== item.value)
                              : [...(selectedValues || []), item.value]
                            onChange(newValues)
                          } else {
                            onChange(item.value)
                            setVisible(false)
                          }
                        }}
                      >
                        <View style={styles.optionRow}>
                          {multiple && (
                            <Checkbox
                              status={selected ? 'checked' : 'unchecked'}
                              onPress={() => {
                                const newValues = selected
                                  ? selectedValues.filter((v: string) => v !== item.value)
                                  : [...(selectedValues || []), item.value]
                                onChange(newValues)
                              }}
                            />
                          )}
                          <Text
                            style={{
                              color: selected
                                ? theme.colors.primary
                                : theme.colors.onSurface,
                              fontWeight: selected ? 'bold' : 'normal',
                            }}
                          >
                            {item.label}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )
                  }}
                />

                {multiple && (
                  <Button
                    mode="contained"
                    onPress={() => setVisible(false)}
                    style={{ marginTop: 12 }}
                  >
                    Done
                  </Button>
                )}
              </Modal>
            </Portal>
          </View>
        )
      }}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  modalContainer: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    maxHeight: '80%',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
})
