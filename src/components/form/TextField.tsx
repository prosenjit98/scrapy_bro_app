import React, { use } from 'react'
import { Controller, FieldValues } from 'react-hook-form'
import { StyleSheet, View, TextInput } from 'react-native';
import { AppTheme } from '@/theme';
import { useThemeStore } from '@/stores/themeStore';
import { HelperText, Text } from 'react-native-paper';
import Icon, { MaterialDesignIconsIconName } from '@react-native-vector-icons/material-design-icons';
// import { TextInput, HelperText } from 'react-native-paper'

type Props = {
  control: any
  name: string
  label: string
  placeholder?: string
  secureTextEntry?: boolean
  multiline?: boolean
  numberOfLines?: number
  rules?: object,
  fontIconName?: MaterialDesignIconsIconName,
  rightIcon?: () => React.ReactNode,
} & FieldValues

export const TextField = (props: Props) => {
  const { theme } = useThemeStore();
  const { colors } = theme;
  const [fieldError, setFieldError] = React.useState<any>(null);
  //@ts-ignore
  const styles = makeStyles(colors);

  return (
    <View style={styles.fieldSection}>
      <Text variant="labelLarge" style={styles.fieldLabel}>{props.label}</Text>
      <View style={[styles.inputWrapper, { borderColor: props?.error ? colors.error : colors.outline }]}>
        {props.fontIconName && <Icon name={props.fontIconName} size={20} color="#999" style={styles.inputIcon} />}

        <Controller
          control={props.control}
          name={props.name}
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            React.useEffect(() => {
              setFieldError(error);
            }, [error]);
            return (
              <TextInput
                style={[styles.input, { paddingRight: 50 }]}
                placeholder={props?.placeholder}
                placeholderTextColor="#999"
                secureTextEntry={props?.secureTextEntry}
                value={value}
                onChangeText={onChange}
                {...props}
              />
            )
          }}
        />
        {props.rightIcon && props.rightIcon()}
      </View>
      {fieldError && (
        <HelperText type="error" visible={!!fieldError}>
          {fieldError?.message}
        </HelperText>
      )}
    </View>
  )
}

const makeStyles = (colors: AppTheme['colors']) =>
  StyleSheet.create({
    fieldSection: {
      marginBottom: 16,
    },
    fieldLabel: {
      marginBottom: 8,
      color: '#333',
      fontWeight: '500',
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 12,
      backgroundColor: '#fff',
    },
    inputIcon: {
      marginRight: 8,
    },
    input: {
      flex: 1,
      paddingVertical: 12,
      fontSize: 16,
      color: '#111',
    }
  });


// export const TextField = ({ control, name, label, placeholder, secureTextEntry, rules, multiline=false, numberOfLines=5, ...props}: Props) => (
//   <Controller
//     control={control}
//     name={name}
//     rules={rules}
//     render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
//       <>
//         <TextInput
//           mode="outlined"
//           label={label}
//           placeholder={placeholder}
//           secureTextEntry={secureTextEntry}
//           value={value}
//           onBlur={onBlur}
//           multiline={multiline}
//           numberOfLines={multiline ? numberOfLines : 1}
//           onChangeText={onChange}
//           error={!!error}
//           style={{ marginBottom: 4 }}
//           {...props}
//         />
//         {error && (
//           <HelperText type="error" visible={!!error}>
//             {error.message}
//           </HelperText>
//         )}
//       </>
//     )}
//   />
// )
